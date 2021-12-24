import React, { Component } from "react"
import { Table, Button, Upload } from "antd"
import { ExcelRenderer } from "react-excel-renderer"
import SaveList from './SaveList'

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

  handleSave = row => {
    const newData = [...this.state.rows]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    this.setState({ rows: newData })
  }

  checkFile(file) {
    let errorMessage = "";
    if (!file || !file[0]) {
      return;
    }
    const isExcel =
      file[0].type === "application/vnd.ms-excel" ||
      file[0].type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      errorMessage = "You can only upload Excel file!";
    }
    console.log("file", file[0].type);
    const isLt2M = file[0].size / 1024 / 1024 < 2;
    if (!isLt2M) {
      errorMessage = "File must be smaller than 2MB!";
    }
    console.log("errorMessage", errorMessage);
    return errorMessage;
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

    const download = e => {
      console.log(e.target.href);
      fetch(e.target.href, {
        method: "GET",
        headers: {}
      })
        .then(response => {
          response.arrayBuffer().then(function(buffer) {
            const url = window.URL.createObjectURL(new Blob([buffer]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "image.jpg"); //or any other extension
            document.body.appendChild(link);
            link.click();
          });
        })
        .catch(err => {
          console.log(err);
        });
    };

    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err)
      } else {
        let newRows = []
        resp.rows.slice(1).map((row, index) => {
          if (row && row !== "undefined") {
            newRows.push({
              key: row[2] !== undefined && index + 1,
              discount: row[2] !== undefined && row[3] !== undefined && (((row[2] - row[3]) / row[2]) * 100).toFixed(0) + "%",
              uic: row[0] !== undefined && row[0],
              name: row[1] !== undefined && row[1],
              mrp: row[2] !== undefined && row[2],
              offer: row[3] !== undefined && row[3],
              url: row[4] !== undefined && <a href={row[4]} download onClick={e => download(e)} target="_blank" >view</a>
            })
          }
        })
        if (newRows.length === 0) {
          this.setState({
            errorMessage: "No data found in file!",
          })
          return false
        } else {
          newRows = newRows.filter(r => r.key !== false)
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

  handleSubmit = async () => {
    console.log("submitting: ", this.state.rows)  
  }

  handleDelete = key => {
    const rows = [...this.state.rows]
    this.setState({ rows: rows.filter(item => item.key !== key) })
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
      <div className="container mt-4">
        <h1 style={{color: "#59d999"}} className="text-center" >DRAFT CONTENT FOR CREATIVES</h1>
        <div>
        {this.state.rows.length > 0 && <SaveList list={this.state.rows} />}
          <Upload
            name="file"
            beforeUpload={this.fileHandler}
            onRemove={() => this.setState({ rows: [] })}
            multiple={false}
          >
            {this.state.rows.length === 0 &&  <Button>
              IMPORT EXCEL
            </Button>}
          </Upload>
        </div>
        <div style={{ marginTop: 20 }}>
          <Table
            rowClassName={() => "editable-row"}
            dataSource={this.state.rows}
            columns={columns}
          />
        </div>

      </div>
    )
  }
}