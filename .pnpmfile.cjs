module.exports = {
  hooks: {
    readPackage: (pkg) => {
      if (pkg.name === "1") {
        delete pkg.dependencies?.mdns2;
        delete pkg.optionalDependencies?.mdns2;
      }
      return pkg;
    }
  }
};
