import { Button, Table, Upload } from "antd";
import React, { Component } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import SaveList from './SaveList';

export default class ExcelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cols: [],
      rows: [],
      errorMessage: null,
      columns: [
        {
          title: "S.No.",
          dataIndex: "key",
          editable: "true"
        },
        {
          title: "Discount %",
          dataIndex: "discount",
          editable: "true"
        },
        {
          title: "UIC",
          dataIndex: "uic",
          editable: "true"
        },
        {
          title: "Product Name",
          dataIndex: "name",
          editable: "true"
        },
        {
          title: "MRP",
          dataIndex: "mrp",
          editable: "true"
        },
        {
          title: "Offer Price",
          dataIndex: "offer",
          editable: "true"
        },
        {
          title: "Product Image URL",
          dataIndex: "url",
        }
      ]
    };
  }

  fileHandler = fileList => {
    console.log("fileList", fileList)
    let fileObj = fileList
    if (!fileObj) {
      this.setState({
        errorMessage: "No file uploaded!",
      })
      return false
    }
    console.log("fileObj.type:", fileObj.type)
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      this.setState({
        errorMessage: "Unknown file format. Only Excel files are uploaded!",
      })
      return false
    }

    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err)
      } else {
        let newRows = []
        resp.rows.slice(1).map((row) => {
          if (row && row !== "undefined") {
            newRows.push({
              // key: row[2] !== undefined && index + 1,
              discount: row[2] !== undefined && row[3] !== undefined && (((row[2] - row[3]) / row[2]) * 100).toFixed(0) + "%",
              uic: row[0] !== undefined && row[0],
              name: row[1] !== undefined && row[1],
              mrp: row[2] !== undefined && `₹${row[2]}`,
              offer: row[3] !== undefined && `₹${row[3]}`,
              url: row[0] !== undefined && <a href={`https://app.dealsdray.com/thumnailimageDynamic_product.aspx?name=${row[0]}&filename=${row[0]}.jpg&size=170&foldername=productfiles&suppliercode=SKU-S1258843`} target="_blank" ><img src={`https://app.dealsdray.com/thumnailimageDynamic_product.aspx?name=${row[0]}&filename=${row[0]}.jpg&size=170&foldername=productfiles&suppliercode=SKU-S1258843`} alt={row[1]} width="40px" /></a>
            })
          }
        })
        if (newRows.length === 0) {
          this.setState({
            errorMessage: "No data found in file!",
          })
          return false
        } else {
          newRows = newRows.filter(r => r.discount !== false)
          newRows.sort((a, b) => parseInt(b.discount) - parseInt(a.discount))
          newRows = newRows.map((n, i) => {
            if (n.discount !== false) {
              return {
                key: i + 1,
                ...n
              }
            }
            return null
          })

          this.setState({
            cols: resp.cols,
            rows: newRows,
            errorMessage: null,
          })
        }
      }
    })
    return false
  }

  render() {

    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          title: col.title,
        }),
      }
    })

    return (
      <div className="container d-flex justify-content-center flex-column">
        <h1 style={{ color: "#59d999" }} className="text-center" >DRAFT CONTENT FOR CREATIVES</h1>
        <div>
          {this.state.rows.length > 0 && <SaveList list={this.state.rows} />}
          {this.state.rows.length === 0 && <div>
          <Upload
            name="file"
            beforeUpload={this.fileHandler}
            onRemove={() => this.setState({ rows: [] })}
            multiple={false}
          >
              <Button>
                IMPORT EXCEL
              </Button>
          </Upload>
          <a href="/sample.xlsx" >download sample excel</a>
         </div>
          }
        </div>
        <div style={{ marginTop: 20 }}>
          {this.state.rows.length > 0 && <Table
            rowClassName={() => "editable-row"}
            dataSource={this.state.rows}
            columns={columns}
          />}
        </div>
      </div>
    )
  }
}