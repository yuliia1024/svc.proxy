const XRegExp = require('xregexp');

const constants = {
  regex: XRegExp('(?:^|[^\\p{L}\\p{N}])(\\p{L}{6})(?=[^\\p{L}\\p{N}]|$)', 'gu')
};

export default <Readonly<typeof constants>> constants;