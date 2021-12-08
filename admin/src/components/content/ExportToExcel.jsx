import React from 'react'
import { CSVLink } from 'react-csv'
import {Button} from 'antd';

const ExportReactCSV = ({csvData, headers, fileName1}) => {

  // const headers = [
  //   { label: "First Name", key: "firstname" },
  //   { label: "Last Name", key: "lastname" },
  //   { label: "Email", key: "email" }
  // ];
  // const data = [
  //   { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
  //   { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
  //   { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
  // ];
    return (
      <Button  danger>
          <CSVLink data={csvData}  headers={headers} filename={fileName1}  target="_blank">Export</CSVLink>
      </Button>
    )
}

export default ExportReactCSV
