# cordova-plugin-swift

A Cordova plugin to enable Swift support in iOS builds. It ensures that your project is configured with the required Swift version, iOS deployment target, and runtime embedding settings for Swift-based plugins to work correctly.

## Why this plugin?

When using Cordova plugins that contain Swift code (e.g., `*.swift` files), your Cordova project must:

- Define a `SWIFT_VERSION` build setting
- Set a valid `IPHONEOS_DEPLOYMENT_TARGET` compatible with your current Xcode/iOS SDK
- Embed Swift standard libraries if needed

This plugin automates these requirements safely and portably, without hardcoding values into your app.

## Installation

Add the plugin to a cordova app:

```sh
cordova plugin add cordova-plugin-swift
```

Use cordova-plugin-swift in you own plugin:

add to your `plugin.xml`:

```xml
<plugin name="cordova-plugin-swift" id="cordova-plugin-swift" version="1.0.0">
```

and/or add to your `package.json`:

```json
"engines": {
    "cordovaDependencies": {
        "x.x.x": { "cordova-plugin-swift": "1.0.0" }
    }
}
```

Where x.x.x is the version of your plugin that starts requiring the cordova-plugin-swift plugin.

## Configuration

Customize the Swift version and deployment target using preferences in your `config.xml`.

You must define the Swift version. This plugin uses `SWIFT_VERSION` to configure the iOS build settings. Set it explicitly using the following in your app's `config.xml`:

```xml
<platform name="ios">
  <preference name="SWIFT_VERSION" value="5.7" />
</platform>
```

### IPHONEOS_DEPLOYMENT_TARGET

Cordova iOS (`cordova-ios`) sets the deployment target automatically in the generated xcode project file. `cordova-plugin-swift` will attempt to read the deployment target value from that generated project file.

You can specify the deployment target that `cordova-plugin-swift` will use, but note that this will not change the project wide deployment target setting.

If no deployment target is found, `cordova-plugin-swift` will default to `12.0`.

#### Example override

```xml
<platform name="ios">
  <preference name="SWIFT_VERSION" value="6" />
  <preference name="IPHONEOS_DEPLOYMENT_TARGET" value="26.0" />
</platform>
```

### Example override for older iOS SDKs that support Swift 4.2

```xml
<platform name="ios">
  <preference name="SWIFT_VERSION" value="4.2" />
  <preference name="IPHONEOS_DEPLOYMENT_TARGET" value="11.0" />
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
- Compatible with Xcode 11.4+ and later

## License

MIT © [Berik Visschers](https://github.com/berikv)
