import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { project } from 'xcode';

export default function (context) {
  const fallbackSwiftVersion = '5.0';
  const fallbackIOSDeploymentTarget = '12.0';

  const projectRoot = context.opts.projectRoot;
  const iosPlatformPath = join(projectRoot, 'platforms', 'ios');
  const projectFiles = readdirSync(iosPlatformPath).filter(e => e.match(/\.xcodeproj$/i));
  if (projectFiles.length === 0) return;

  const projectName = projectFiles[0].replace('.xcodeproj', '');
  const pbxprojPath = join(iosPlatformPath, `${projectName}.xcodeproj`, 'project.pbxproj');
  const xcodeProject = project(pbxprojPath);
  xcodeProject.parseSync();

  const COMMENT_KEY = /_comment$/;
  const buildConfigs = xcodeProject.pbxXCBuildConfigurationSection();
  const overrideiOSDeploymentTarget = context.opts.plugin.pluginInfo.getPreferences().OverrideiOSDeploymentTarget;
  const swiftVersion = context.opts.plugin.pluginInfo.getPreferences().SwiftVersion || fallbackSwiftVersion;

  for (const configName in buildConfigs) {
    if (!COMMENT_KEY.test(configName)) {
      const buildConfig = buildConfigs[configName];

      // Set the swift version
      if (!xcodeProject.getBuildProperty('SWIFT_VERSION', buildConfig.name)) {
        xcodeProject.updateBuildProperty('SWIFT_VERSION', swiftVersion, buildConfig.name);
        console.log(`[swift] Set SWIFT_VERSION to ${swiftVersion} for ${buildConfig.name}`);
      }

      // Set the iOS deployment target, if not set
      if (overrideiOSDeploymentTarget) {
        xcodeProject.updateBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', overrideiOSDeploymentTarget, buildConfig.name);
        console.log(`[swift] Set IPHONEOS_DEPLOYMENT_TARGET to ${overrideiOSDeploymentTarget} for ${buildConfig.name}`);
      } else if (xcodeProject.getBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', buildConfig.name) == null) {
                xcodeProject.updateBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', fallbackIOSDeploymentTarget, buildConfig.name);
        console.log(`[swift] Set IPHONEOS_DEPLOYMENT_TARGET to ${fallbackIOSDeploymentTarget} for ${buildConfig.name}`);

      }

      // Make sure that the Swift standard library runtime is inserted in the app binary
      xcodeProject.updateBuildProperty('ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES', 'YES', buildConfig.name);
    }
  }

  writeFileSync(pbxprojPath, xcodeProject.writeSync());
};
