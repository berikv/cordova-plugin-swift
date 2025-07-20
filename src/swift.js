const { readdirSync, writeFileSync } = require('fs');
const { join } = require('path');
const { project } = require('xcode');

module.exports = function (context) {
  console.log('[cordova-plugin-swift] Updating Xcode project for Swift support...');

  const fallbackSwiftVersion = '5.0';
  const fallbackIOSDeploymentTarget = '12.0';

  const projectRoot = context.opts.projectRoot;
  const iosPlatformPath = join(projectRoot, 'platforms', 'ios');
  const projectFiles = readdirSync(iosPlatformPath).filter(e => e.match(/\.xcodeproj$/i));

  if (projectFiles.length === 0) {
    console.error('[cordova-plugin-swift] No Xcode project found, did you add cordova-ios?');
    return;
  }

  const projectName = projectFiles[0].replace('.xcodeproj', '');
  const pbxprojPath = join(iosPlatformPath, `${projectName}.xcodeproj`, 'project.pbxproj');
  const xcodeProject = project(pbxprojPath);
  xcodeProject.parseSync();

  const COMMENT_KEY = /_comment$/;
  const buildConfigs = xcodeProject.pbxXCBuildConfigurationSection();
  const SWIFT_VERSION = context.opts.plugin.pluginInfo.getPreferences().SWIFT_VERSION || fallbackSwiftVersion;
  const IPHONEOS_DEPLOYMENT_TARGET = context.opts.plugin.pluginInfo.getPreferences().IPHONEOS_DEPLOYMENT_TARGET || fallbackIOSDeploymentTarget;

  if (Object.keys(buildConfigs).length === 0) {
    console.error('[cordova-plugin-swift] No build configurations found, please recheck your setup');
    return;
  }

  for (const configName in buildConfigs) {
    if (!COMMENT_KEY.test(configName)) {
      const buildConfig = buildConfigs[configName];

      // Set the swift version if not set
      const currentSwiftVersion = xcodeProject.getBuildProperty('SWIFT_VERSION', buildConfig.name);
      if (currentSwiftVersion == null || currentSwiftVersion.trim() === '') {
        xcodeProject.updateBuildProperty('SWIFT_VERSION', SWIFT_VERSION, buildConfig.name);
        console.log(`[cordova-plugin-swift] Set SWIFT_VERSION to ${SWIFT_VERSION} for ${buildConfig.name}`);
      } else {
        console.log(`[cordova-plugin-swift] Skipping SWIFT_VERSION for ${buildConfig.name}, already set to ${currentSwiftVersion}`);
      }


      // Set the iOS deployment target if not set
      const currentDeploymentTarget = xcodeProject.getBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', buildConfig.name);
      if (currentDeploymentTarget == null || currentDeploymentTarget.trim() === '') {
        xcodeProject.updateBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', IPHONEOS_DEPLOYMENT_TARGET, buildConfig.name);
        console.log(`[cordova-plugin-swift] Set IPHONEOS_DEPLOYMENT_TARGET to ${IPHONEOS_DEPLOYMENT_TARGET} for ${buildConfig.name}`);
      } else {
        console.log(`[cordova-plugin-swift] Skipping IPHONEOS_DEPLOYMENT_TARGET for ${buildConfig.name}, already set to ${currentDeploymentTarget}`);
      }

      // Make sure that the Swift standard library runtime is inserted in the app binary
      xcodeProject.updateBuildProperty('ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES', 'YES', buildConfig.name);
    }
  }

  writeFileSync(pbxprojPath, xcodeProject.writeSync());
};
