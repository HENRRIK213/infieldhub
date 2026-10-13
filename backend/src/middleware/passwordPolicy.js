exports.validatePassword = (p) => {
  const e = [];
  if (!p || p.length < 12) e.push('At least 12 characters');
  if (!/[A-Z]/.test(p)) e.push('At least one uppercase letter');
  if (!/[a-z]/.test(p)) e.push('At least one lowercase letter');
  if (!/[0-9]/.test(p)) e.push('At least one number');
  if (!/[^A-Za-z0-9]/.test(p)) e.push('At least one special character');
  return e;
};