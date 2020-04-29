module.exports = {
  name: 'helping-hand-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/helping-hand-app',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
