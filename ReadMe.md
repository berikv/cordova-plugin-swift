# cordova-plugin-swift

A Cordova plugin to enable Swift support in iOS builds. It ensures that your project is configured with the required Swift version, iOS deployment target, and runtime embedding settings for Swift-based plugins to work correctly.

## Why this plugin?

When using Cordova plugins that contain Swift code (e.g., `*.swift` files), your Cordova project must:

- Define a `SWIFT_VERSION` build setting
- Set a valid `IPHONEOS_DEPLOYMENT_TARGET` compatible with your current Xcode/iOS SDK
- Embed Swift standard libraries if needed

This plugin automates these requirements safely and portably, without hardcoding values into your app.

## Installation

```sh
cordova plugin add cordova-plugin-swift
```

## Configuration

Customize the Swift version and deployment target using preferences in your `config.xml`.

### Default behavior (no config)

- `SWIFT_VERSION` is set to `5.0` (only if not already set)
- `IPHONEOS_DEPLOYMENT_TARGET` is set to `12.0` (only if not already set)
- `ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES` is always set to `YES`

### Optional preferences

To override these values, add to your `config.xml`:

```xml
<platform name="ios">
  <preference name="SwiftVersion" value="5.7" />
  <preference name="OverrideiOSDeploymentTarget" value="14.0" />
</platform>
```

These preferences will **override existing values**, even if they're already defined by Cordova or other plugins.

### Example: support Swift 4.2 for older plugin

```xml
<platform name="ios">
  <preference name="SwiftVersion" value="4.2" />
  <preference name="OverrideiOSDeploymentTarget" value="11.0" />
</platform>
```

> ⚠️ Use this only if you're targeting older iOS SDKs and your Xcode version supports it.

## What this plugin modifies

For every build configuration (Debug/Release), it will:

- Set `SWIFT_VERSION` (if not set or overridden)
- Set `IPHONEOS_DEPLOYMENT_TARGET` (if not set or overridden)
- Set `ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES = YES`

## Compatibility

- Requires Cordova CLI ≥ 10.0.0
- Requires `cordova-ios` ≥ 6.0.0
- Compatible with Xcode 12+

## License

MIT © [Berik Visschers](https://github.com/berikv)
