# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

## Vercel deployment

The web part of our project is deployed on Vercel. Vercel is an american cloud application company.

This way, we have access to free automatic deployments that are fast and that we can monitor easily.

The main branch for example will be deployed to : https://talk-up-ai.vercel.app everytime there is a new commit pushed on it.
Preview deployements will also be made whenever a Pull Request is created

To deploy locally you just need to use the command : `vercel`. A preview url will be created for you to test your changes.

First time users will have to login to the vercel account. For that, you can use the command `vercel login` and then follow on the website with our contact email adress `contact.talkup.ai@gmail.com`
