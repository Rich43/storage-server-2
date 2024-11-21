export default {
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    testTimeout: 60000,
};
