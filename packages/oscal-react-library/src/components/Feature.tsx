import React from "react";
import { FeatureFlagConfiguration, FeatureFlags } from "../contexts/FeatureFlags";

export type FeatureFlagKey<T extends FeatureFlagConfiguration> = keyof T;

export interface FeatureProps<T extends FeatureFlagConfiguration = FeatureFlagConfiguration> {
  feature: FeatureFlagKey<T>;
  children: React.ReactNode;
}

function isFeatureEnabled<T extends FeatureFlagConfiguration = FeatureFlagConfiguration>(
  features: T,
  feature: string | number | symbol
): boolean {
  if (feature in features) {
    return (features as any)[feature] ?? false;
  }
  return false;
}

export function Feature<T extends FeatureFlagConfiguration = FeatureFlagConfiguration>({
  feature,
  children,
}: FeatureProps<T>) {
  const { features } = React.useContext(FeatureFlags);
  if (isFeatureEnabled(features, feature)) {
    return null;
  }
  return children;
}
