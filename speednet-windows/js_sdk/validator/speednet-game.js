// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "game_name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "label": "游戏名称"
  },
  "picture": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "label": "游戏封面"
  },
  "regions": {
    "rules": [
      {
        "format": "array"
      }
    ],
    "label": "区服列表"
  },
  "platform": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
          {
            "value": 1,
            "text": "PC"
          },
          {
            "value": 2,
            "text": "Android"
          }
        ]
      }
    ],
    "label": "游戏平台"
  }
}

const enumConverter = {
  "platform_valuetotext": {
    "1": "PC",
    "2": "Android"
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
