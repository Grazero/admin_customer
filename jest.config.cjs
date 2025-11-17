// jest.config.cjs (ใช้ .cjs สำหรับ CommonJS)
module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testMatch: [
    '**/tests/unit/**/*.test.js'
  ],
  moduleFileExtensions: [
    'js',
    'vue'
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest'
  }
}