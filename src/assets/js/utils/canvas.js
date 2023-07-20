// #CANVAS

// #EXPORT

export function drawCircle(context, x, y, r)
{
    context.beginPath()
    context.arc(x, y, r, 0, 2 * Math.PI)
    context.fill()
    context.closePath()
}