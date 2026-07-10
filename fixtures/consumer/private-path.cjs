try {
  require.resolve('@noah-ji/lyra-ui/data-input/form/context');
  throw new Error('private form context path was exported');
} catch (error) {
  if (error?.code !== 'ERR_PACKAGE_PATH_NOT_EXPORTED') throw error;
}
