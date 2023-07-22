// #CANVAS

// #CONSTANTE

const PI_MUL_2 = Math.PI * 2

// #EXPORTS

export function drawCircle(context, x, y, r)
{
    context.beginPath()
    context.arc(x, y, r, 0, PI_MUL_2)
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

export function drawEllipse(context, a, b, x, y)
{
    context.beginPath()
    context.ellipse(x, y, a, b + 60, 0, 0, PI_MUL_2)
    context.fill()
    context.closePath()
}