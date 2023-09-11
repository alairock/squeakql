export const objectDiffShallow = (previous: any, current: any) => ({
  ...Object.keys(current).reduce(
    (obj, key) => (current[key] !== previous[key] ? {...obj, [key]: current[key]} : {...obj}),
    {}
  ),
  ...Object.keys(previous).reduce((obj, key) => (previous[key] && !current[key] ? {...obj, [key]: null} : {...obj}), {})
})
