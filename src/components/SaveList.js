import React from 'react'
import { Button } from "antd"
import { saveAs } from 'file-saver';

export const SaveList = ({ list }) => {
    var JSZip = require("jszip");
    let zip = new JSZip();

    const handleDownloadClick = async () => {

        for (let i = 0; i < list.length; i++) {
            const myUrl = list[i].url.props.href
            const response = await fetch(myUrl);
            response.blob().then(blob => {
                var img = zip.folder("1. images");
                img.file(`${i+1}.jpg`, blob, { base64: true });
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

        zip.file("2. margin.txt", discount());
        zip.file("3. product-name.txt", name());
        zip.file("4. mrp.txt", mrp());
        zip.file("5. offer-price.txt", offer());

        const d = new Date()

        zip.generateAsync({ type: "blob" })
            .then(function (content) {
                saveAs(content, `${d.getDate()}-${d.getMonth()}-${d.getFullYear().toString().slice(2)}-${d.getHours()}-${d.getMinutes()} CONTENT FOR CREATIVES`);
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