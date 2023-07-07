/* #FPS */

export default function getFps()
{
    const startTime = performance.now()

    let count = 0

    return new Promise(resolve =>
    {
        function frame()
        {
            count++

            performance.now() - startTime >= 500 ? resolve(count * 2) : requestAnimationFrame(frame)
        }

        frame()
    })
  }