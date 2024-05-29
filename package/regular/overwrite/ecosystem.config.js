module.exports = {
  apps: [
    {
      name: 'booza',
      script: './dist/server/main.js',
      env: {
        NODE_ENV: 'production',
        SERVER_PORT: '3000',
      },
    },
  ],
};
