// #COLOR

// #EXPORT

export function rgb(color) { return color.match(/\w\w/g).map(x => parseInt(x, 16)) }

export function rgba(color, alpha) { return `rgba(${rgb(color)}, ${alpha})` }