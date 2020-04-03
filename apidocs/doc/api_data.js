define({ "api": [
  {
    "type": "post",
    "url": "/user/create",
    "title": "create user information",
    "name": "Create_user",
    "group": "User",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "key1",
            "description": "<p>description.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "key2",
            "description": "<p>description</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>success</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Successfully done</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"message\": \"Successfully done\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "INTERNAL_SERVER_ERROR:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"message\": \"Internal Server Error\",\n  \"code\": \"INTERNAL_SERVER_ERROR\",\n  \"httpCode\": 500\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.rest.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/create",
    "title": "create user information",
    "name": "Create_user",
    "group": "User",
    "parameter": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "key1",
            "description": "<p>description.</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "key2",
            "description": "<p>description</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>success</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Successfully done</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"message\": \"Successfully done\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "INTERNAL_SERVER_ERROR:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"message\": \"Internal Server Error\",\n  \"code\": \"INTERNAL_SERVER_ERROR\",\n  \"httpCode\": 500\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.rest.js",
    "groupTitle": "User"
  },
  {
    "type": "delete",
    "url": "/user/:id",
    "title": "delete user",
    "name": "Delete_user",
    "group": "User",
    "parameter": {
      "fields": {
        "param": [
          {
            "group": "param",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id of user to delete</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>success</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Successfully done</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"message\": \"Successfully done\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "INTERNAL_SERVER_ERROR:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"message\": \"Internal Server Error\",\n  \"code\": \"INTERNAL_SERVER_ERROR\",\n  \"httpCode\": 500\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.rest.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/user/:id",
    "title": "update user information",
    "name": "Update_user",
    "group": "User",
    "parameter": {
      "fields": {
        "param": [
          {
            "group": "param",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id of user to update</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "key1",
            "description": "<p>description</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "key2",
            "description": "<p>description</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>success</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Successfully done</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"message\": \"Successfully done\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "INTERNAL_SERVER_ERROR:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"message\": \"Internal Server Error\",\n  \"code\": \"INTERNAL_SERVER_ERROR\",\n  \"httpCode\": 500\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.rest.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/:id",
    "title": "get user details",
    "name": "user_Details",
    "group": "User",
    "parameter": {
      "fields": {
        "param": [
          {
            "group": "param",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>id of user to fetch details</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>success</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Successfully done</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"message\": \"Successfully done\",\n  \"data\": {}\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "INTERNAL_SERVER_ERROR:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"message\": \"Internal Server Error\",\n  \"code\": \"INTERNAL_SERVER_ERROR\",\n  \"httpCode\": 500\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.rest.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/list?page_no=1&limit=10&search=xyz",
    "title": "user listing",
    "name": "user_listing",
    "group": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>success</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Successfully done</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"message\": \"Successfully done\",\n  \"data\": []\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "INTERNAL_SERVER_ERROR:",
          "content": "HTTP/1.1 500 Internal server error\n{\n  \"message\": \"Internal Server Error\",\n  \"code\": \"INTERNAL_SERVER_ERROR\",\n  \"httpCode\": 500\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user.rest.js",
    "groupTitle": "User"
  }
] });
