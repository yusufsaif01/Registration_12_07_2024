module.exports = (data) => {
    return `
<!DOCTYPE html>
<html>
  <head>
    <title>Homepage</title>
    <style>
      * {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
      }
    </style>
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Paytone+One&display=swap"
      rel="stylesheet"
    />
  </head>

  <body style="background: #f6f6f6;">
    <table
      style="
        display: block;
        background: #fff;
        border-radius: 10px;
        width: 95%;
        margin: 40px auto;
      "
    >
      <thead
        style="
          display: block;
          width: 100%;
          background: #fbf9f9;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        "
      >
        <tr style="height: 10px;">
          <td></td>
        </tr>
        <tr style="display: block; width: 100%;">
          <th style="text-align: center; display: block; width: 100%;">
            <img src="${data.appUrl}assets/images/yftchain.png" alt="logo" width="250px" />
          </th>
        </tr>
        <tr style="height: 10px;">
          <td></td>
        </tr>
      </thead>
    `;
}