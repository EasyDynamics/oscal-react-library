#!/usr/bin/env ts-node
import {
  TypeScriptTargetLanguage,
  TypeScriptRenderer,
  RenderContext,
  tsFlowOptions,
  getOptionValues,
  ClassType,
  modifySource,
  EnumType,
  Name,
  Namer,
  funPrefixNamer,
} from 'quicktype-core';
import { isES3IdentifierPart, isES3IdentifierStart } from 'quicktype-core/dist/language/JavaScriptUnicodeMaps';
import { acronymStyle } from 'quicktype-core/dist/support/Acronyms';
import { allUpperWordStyle, combineWords, splitIntoWords, utf16LegalizeCharacters, utf16StringEscape } from 'quicktype-core/dist/support/Strings';

import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { JSONSchemaInput, InputData, quicktype } from 'quicktype-core';


// These helpers are copied & pasted from the `quicktype-core` code base. They aren't exported
// but they're necessary in our implementations of some things.
const legalizeName = utf16LegalizeCharacters(isES3IdentifierPart);
function quotePropertyName(original: string): string {
  const escaped = utf16StringEscape(original);
  const quoted = `'${escaped}'`;

  if (original.length === 0) {
    return quoted;
  } else if (!isES3IdentifierStart(original.codePointAt(0) as number)) {
    return quoted;
  } else if (escaped !== original) {
    return quoted;
  } else if (legalizeName(original) !== original) {
    return quoted;
  } else {
    return original;
  }
}
// End copy & pasted helpers

class JsiiCompatTypeScriptTargetLanguage extends TypeScriptTargetLanguage {
  protected makeRenderer(renderContext: RenderContext, untypedOptionValues: { [name: string]: any }): TypeScriptRenderer {
    return new JsiiCompatTypeScriptRenderer(this, renderContext, getOptionValues(tsFlowOptions, untypedOptionValues));
  }
}

/**
 * This implements a renderer for TypeScript that is mostly compatible with the preferences
 * of JSII.
 *
 * To achieve this goal, enums cases are all upper snake case, interface members are all
 * readonly, and dead code is removed from the module helpers.
 */
class JsiiCompatTypeScriptRenderer extends TypeScriptRenderer {

  protected makeEnumCaseNamer(): Namer {
    return funPrefixNamer('enum-cases', s => {
      const acronyms = acronymStyle(this._tsFlowOptions.acronymStyle);
      const words = splitIntoWords(s);
      // Effectively, this is the right combination of functions (all upper case and with
      // a `_` separator) to make the enum variants all LOOK_LIKE_THIS instead of LookLikeThis,
      // which would be the default.
      return combineWords(
        words,
        legalizeName,
        allUpperWordStyle,
        allUpperWordStyle,
        allUpperWordStyle,
        acronyms,
        '_',
        isES3IdentifierStart,
      );
    });
  }
  protected emitClassBlockBody(c: ClassType): void {
    this.emitPropertyTable(c, (name, _jsonName, p) => {
      const t = p.type;
      // This basically implements the same behavior as the parent with some basic changes:
      //  - `readonly` is added
      //  - no attempt is made to keep things table-looking (doing so annoys the linter)
      return [
        [
          'readonly ',
          modifySource(quotePropertyName, name),
          p.isOptional ? '?' : '',
          ': ',
          this.sourceFor(t).source,
          ';',
        ],
      ];
    });

    const additionalProperties = c.getAdditionalProperties();
    if (additionalProperties) {
      this.emitTable([['[property: string]', ': ', this.sourceFor(additionalProperties).source, ';']]);
    }
  }

  protected emitEnum(e: EnumType, enumName: Name): void {
    this.emitBlock(['export enum ', enumName, ' '], '', () => {
      this.forEachEnumCase(e, 'none', (name, jsonName) => {
        this.emitLine(name, ` = '${utf16StringEscape(jsonName)}',`);
      });
    });
  }

  protected emitConvertModuleHelpers(): void {
    if (this._tsFlowOptions.runtimeTypecheck) {
      const {
        any: anyAnnotation,
        anyArray: anyArrayAnnotation,
        anyMap: anyMapAnnotation,
        string: stringAnnotation,
        stringArray: stringArrayAnnotation,
        never: neverAnnotation,
      } = this.typeAnnotations;
      this.ensureBlankLine();
      // This block is just really annoying. It is a copy & paste version of the parent
      // class implementation (actually, I think it comes from JavaScript instead of the
      // TypeScriptFlow class) but with the `m` function removed. TypeScript gets really
      // grumpy if we have unused functions so this just deletes this. The right fix is
      // to make TypeScript less grumpy but this was honestly faster.
      this
        .emitMultiline(`function invalidValue(typ${anyAnnotation}, val${anyAnnotation}, key${anyAnnotation}, parent${anyAnnotation} = '')${neverAnnotation} {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? \` on \${parent}\` : '';
    const keyText = key ? \` for key "\${key}"\` : '';
    throw Error(\`Invalid value\${keyText}\${parentText}. Expected \${prettyTyp} but got \${JSON.stringify(val)}\`);
}

function prettyTypeName(typ${anyAnnotation})${stringAnnotation} {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return \`an optional \${prettyTypeName(typ[1])}\`;
        } else {
            return \`one of [\${typ.map(a => { return prettyTypeName(a); }).join(", ")}]\`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ${anyAnnotation})${anyAnnotation} {
    if (typ.jsonToJS === undefined) {
        const map${anyAnnotation} = {};
        typ.props.forEach((p${anyAnnotation}) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ${anyAnnotation})${anyAnnotation} {
    if (typ.jsToJSON === undefined) {
        const map${anyAnnotation} = {};
        typ.props.forEach((p${anyAnnotation}) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val${anyAnnotation}, typ${anyAnnotation}, getProps${anyAnnotation}, key${anyAnnotation} = '', parent${anyAnnotation} = '')${anyAnnotation} {
    function transformPrimitive(typ${stringAnnotation}, val${anyAnnotation})${anyAnnotation} {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }
    function transformUnion(typs${anyArrayAnnotation}, val${anyAnnotation})${anyAnnotation} {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }
    function transformEnum(cases${stringArrayAnnotation}, val${anyAnnotation})${anyAnnotation} {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }
    function transformArray(typ${anyAnnotation}, val${anyAnnotation})${anyAnnotation} {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }
    function transformDate(val${anyAnnotation})${anyAnnotation} {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }
    function transformObject(props${anyMapAnnotation}, additional${anyAnnotation}, val${anyAnnotation})${anyAnnotation} {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result${anyAnnotation} = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = ${
  this._tsFlowOptions.runtimeTypecheckIgnoreUnknownProperties
    ? 'val[key]'
    : 'transform(val[key], additional, getProps, key, ref)'
};
            }
        });
        return result;
    }
    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref${anyAnnotation} = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

${this.castFunctionLines[0]} {
    return transform(val, typ, jsonToJSProps);
}

${this.castFunctionLines[1]} {
    return transform(val, typ, jsToJSONProps);
}

function l(typ${anyAnnotation}) {
    return { literal: typ };
}

function a(typ${anyAnnotation}) {
    return { arrayItems: typ };
}

function u(...typs${anyArrayAnnotation}) {
    return { unionMembers: typs };
}

function o(props${anyArrayAnnotation}, additional${anyAnnotation}) {
    return { props, additional };
}

function r(name${stringAnnotation}) {
    return { ref: name };
}
`);
      this.emitTypeMap();
    }
  }
}

type Schema = {
  typeName: string;
  schemaContent: string;
}
function generateInterfaces(
  schemas: Schema[],
) {
  const schemaInput = new JSONSchemaInput(undefined);
  const inputData = new InputData();
  for (const schema of schemas) {
    schemaInput.addSource({ name: schema.typeName, schema: schema.schemaContent });
  }
  inputData.addInput(schemaInput);
  return quicktype({
    inputData,
    lang: new JsiiCompatTypeScriptTargetLanguage(),
    rendererOptions: { 'nice-property-names': 'false' },
  });
}

interface FileGenerationOptions {
  readonly inputSchemaDirectory: string;
  readonly topLevelAttribute: string;
  readonly outputPath: string;
}

async function buildFile(options: FileGenerationOptions) {
  // It theoretically would be possible to specify all the specific schemas here instead;
  // however, doing that and emitting it to a single document currently results in a lot
  // of duplicate types beign emitted (for example, one `Metadata` for each root document
  // type). Instead, we'll use the complete schema. This generates a very large file but
  // at least it makes things a little bit cleaner.
  const oscalSchemas = [
    {
      name: 'OSCAL',
      file: 'complete'
    },
  ];
  const interfaceGenProps = oscalSchemas
    .map((def) =>
     ({
       typeName: def.name,
       schemaContent: fs.readFileSync(
         path.join(
           options.inputSchemaDirectory,
           `oscal_${def.file}_schema.json`
         )
       ).toString('utf-8')
     })
    );
  const result = generateInterfaces(interfaceGenProps);
  try {
    fs.writeFileSync(options.outputPath.toString(), (await result).lines.join('\n'));
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error("Usage: generate-types.ts <OSCAL-VERSION> <SCHEMA-DIR> <PACKAGE-PATH>")
  }
  const schemaFile = args[0];
  const packagePath = args[1];
  const topLevelAttribute = "OSCAL";

  await buildFile({
    inputSchemaDirectory: schemaFile,
    outputPath: path.join(packagePath, 'oscal.ts'),
    topLevelAttribute,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

