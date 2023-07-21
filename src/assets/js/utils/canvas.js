// #CANVAS

// #EXPORTS

export function drawCircle(context, x, y, r)
{
    context.beginPath()
    context.arc(x, y, r, 0, 2 * Math.PI)
    context.fill()
    context.closePath()
}

export function drawTriangle(context, x, y, w, h, s)
{
    context.beginPath()
    context.moveTo(x - w / 2, y)
    context.lineTo(s, y - h)
    context.lineTo(x + w / 2, y)
    context.fill()
    context.stroke()
    context.closePath()
}