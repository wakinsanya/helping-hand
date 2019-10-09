module.exports = {
  name: 'helping-hand-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/helping-hand-app',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
