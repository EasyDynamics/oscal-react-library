export * from "./oscal";

// Because of the type generation, some items get generated with "fun" names by the
// `quicktype` library. Rather than modifying the `oscal.ts` file, they are exported
// using better names.
// It is possible that in the future, these may flip (or other "State"s will be added
// causing these to change). We should keep an eye on this. Consumers of the library
// should only consider the more serious-looking names to be stable.
export {
  FluffyState as SystemCharacteristicStatusState,
  PurpleState as ComponentStatusState,
} from "./oscal";
