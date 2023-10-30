import Clock from './deps/clock.js';
import View from './view.js';
const view = new View();
const clock = new Clock();

const worker = new Worker('./src/worker/worker.js', {
    type: 'module'
});

worker.onerror = (error) => {
    console.error('error worker', error)
}

//acionado toda vez que o worker chama o self.postMessage
worker.onmessage = ({ data }) => {
    if(data.status !== 'done') return;
    clock.stop()
    view.updateElapsedTime(`Process took ${took.replace('ago', '')}`)
    if (!data.buffers) return;
    view.downloadBlobAsFile(
        data.buffers,
        data.filename
    )

    console.log('recebi no processo da view', data)
}

let took = ''
//aciona todo o processo quando um arquivo é selecionado
view.configureOnFileChange(file => {
    const canvas = view.getCanvas();

    //joga o processamento do arquivo e o controle do canvas para o worker
    worker.postMessage({
        file,
        canvas
    }, [
        canvas
    ])

    clock.start((time) => {
        took = time;
        view.updateElapsedTime(`Process started ${time}`)
    })
})

//método utilizado apenas para debug, simula um usuário selecionando um arquivo
async function fakeFetch() {
    const filePath = '/videos/frag_bunny.mp4'
    const response = await fetch(filePath)

    const file = new File([await response.blob()], filePath, {
        type: 'video/mp4',
        lastModified: Date.now()
    })
    const event = new Event('change')
    Reflect.defineProperty(
        event,
        'target',
        { value: { files: [file] } }
    )

    document.getElementById('fileUpload').dispatchEvent(event)
}

// fakeFetch()