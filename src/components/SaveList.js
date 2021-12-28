import React from 'react'
import { Button } from "antd"
import { saveAs } from 'file-saver';
import 'antd/dist/antd.css';

export const SaveList = ({ list }) => {
    var JSZip = require("jszip");
    let zip = new JSZip();

    const handleDownloadClick = async () => {

        for (var i = 0; i < list.length; i++) {
            const myUrl = list[i].url.props.src
            const response = await fetch(myUrl);
            response.blob().then(blob => {
                var img = zip.folder("images");
                img.file(`${i}.jpg`, blob, { base64: true });
            });
        }

        const discount = () => {
            const d = list.map(r => r.discount)
            return new Blob([d.join('\n')], { type: 'text/plain' })
        }
        const name = () => {
            const n = list.map(r => r.name)
            return new Blob([n.join('\n')], { type: 'text/plain' })
        }
        const mrp = () => {
            const m = list.map(r => r.mrp)
            return new Blob([m.join('\n')], { type: 'text/plain' })
        }
        const offer = () => {
            const o = list.map(r => r.offer)
            return new Blob([o.join('\n')], { type: 'text/plain' })
        }

        zip.file("margin.txt", discount());
        zip.file("product-name.txt", name());
        zip.file("mrp.txt", mrp());
        zip.file("offer-price.txt", offer());

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                // see FileSaver.js
                saveAs(content, "whatsDraft.zip");
            });
    }


    return (
        <div className="d-flex justify-content-between">
            <h3 style={{ color: "#59d999" }} >Products has been imported</h3>
            <Button onClick={handleDownloadClick} >EXPORT CONTENT</Button>
        </div>

    );
}

export default SaveList