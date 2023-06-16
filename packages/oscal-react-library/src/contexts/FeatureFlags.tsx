import React from "react";

export interface FeatureFlagConfiguration {
  isEditingEnabled: boolean;
  isEnterpriseSupportEnabled: boolean;
}

const defaultFeatures: FeatureFlagConfiguration = {
  isEditingEnabled: false,
  isEnterpriseSupportEnabled: false,
};

export const FeatureFlags = React.createContext({
  features: JSON.parse(JSON.stringify(defaultFeatures)) as FeatureFlagConfiguration,
});

export interface FeatureFlagsProviderProps<
  T extends FeatureFlagConfiguration = FeatureFlagConfiguration
> {
  children: React.ReactNode;
  flags: T;
}

export const FeatureFlagsProvider: React.FC<FeatureFlagsProviderProps> = ({ children, flags }) => {
  const [features, _setFeatures] = React.useState(flags);
  return <FeatureFlags.Provider value={{ features }}>{children}</FeatureFlags.Provider>;
};
