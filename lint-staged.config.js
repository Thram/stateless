module.exports = {
  linters: {
    'src/**/*.+(js|jsx|json)': [
      'eslint --fix',
    ],
    'src/**/*.+(js|md|ts|css|sass|less|graphql|yml|yaml|scss|json|vue)': [
      'prettier --write',
      'git add',
    ],
  },
};
