import React from 'react'
import { Button } from "antd"
import 'antd/dist/antd.css';

export const SaveList = ({ list }) => {
    const downloadTxtFile = () => {
        // const file = new Blob([document.getElementById('myInput').value], { type: 'text/plain' });
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

        const element = document.createElement("a");
        element.href = URL.createObjectURL(discount());
        element.download = "margin.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();

        const element2 = document.createElement("a");
        element2.href = URL.createObjectURL(name());
        element2.download = "product-name.txt";
        document.body.appendChild(element2); // Required for this to work in FireFox
        element2.click();

        const element3 = document.createElement("a");
        element3.href = URL.createObjectURL(mrp());
        element3.download = "mrp.txt";
        document.body.appendChild(element3); // Required for this to work in FireFox
        element3.click();

        const element4 = document.createElement("a");
        element4.href = URL.createObjectURL(offer());
        element4.download = "offer-price.txt";
        document.body.appendChild(element4); // Required for this to work in FireFox
        element4.click();
    }


    return (
        <div className="d-flex justify-content-between">
            <h3 style={{ color: "#59d999" }} >Products has been imported</h3>
            <Button onClick={downloadTxtFile} >EXPORT CONTENT</Button>
        </div>

    );
}

export default SaveList