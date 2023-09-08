/* eslint-disable @typescript-eslint/no-var-requires */
const { PluginBase } = require('@electron-forge/plugin-base');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

module.exports = class NodeDatachannelPlugin extends PluginBase {
    name = 'plugin-node-datachannel';

    getHooks() {
        return {
            generateAssets: this.generateAssets,
        };
    }

    generateAssets(config) {
        return new Promise((resolve, reject) => {
            try {
                // if there is no node-datachannel folder, then return
                if (!fs.existsSync(path.join(__dirname, '..', 'node-datachannel'))) {
                    return resolve();
                }

                if (
                    fs.existsSync(
                        path.join(
                            __dirname,
                            '..',
                            'node-datachannel',
                            'build',
                            'Release',
                            'plugin-node-datachannel-ok',
                        ),
                    )
                ) {
                    return resolve();
                } else {
                    // if there is no node-datachannel-plugin-ok file, then we need to build the module
                    execSync(
                        `cd ${path.join(__dirname, '..', 'node-datachannel')} && npm run install --build-from-source`,
                        {
                            stdio: 'inherit',
                        },
                    );
                    fs.writeFileSync(
                        path.join(
                            __dirname,
                            '..',
                            'node-datachannel',
                            'build',
                            'Release',
                            'plugin-node-datachannel-ok',
                        ),
                        '',
                    );
                    return resolve();
                }
            } catch (e) {
                reject(e);
            }
        });
    }
};
