export const privateInfo = {
  name: {
    allowNull: false,
    regex: null,
    label: '真實姓名',
    messages: {
      missing: '你叫什麼名字？'
    }
  },
  birth_year: {
    allowNull: false,
    regex: null,
    label: '出生年',
    messages: {
      missing: '你幾年出生？'
    }
  },
  birth_month: {
    allowNull: false,
    regex: null,
    label: '月',
    messages: {
      missing: '你幾月出生？'
    }
  },
  birth_date: {
    allowNull: false,
    regex: null,
    label: '日',
    messages: {
      missing: '你幾號出生？'
    }
  },
  country_code: {
    allowNull: false,
    regex: null,
    label: '國碼',
    messages: {
      missing: '請填入電話國碼'
    }
  },
  phone_number: {
    allowNull: false,
    regex: null,
    label: '行動電話',
    messages: {
      missing: '請填入行動電話'
    }
  },
  gender: {
    allowNull: false,
    regex: null,
    label: '性別',
    messages: {
      missing: '請填入性別'
    }
  },
  voter_type: {
    allowNull: false,
    regex: null,
    label: '投票人類別',
    messages: {
      missing: '請填入類別'
    }
  },
  voter_city: {
    allowNull: false,
    regex: null,
    label: '戶籍城市',
    messages: {
      missing: '你的戶籍在哪個城市？'
    }
  },
  voter_district: {
    allowNull: false,
    regex: null,
    label: '戶籍區域',
    messages: {
      missing: '你的戶籍在哪一區？'
    }
  },
  voter_neighborhood: {
    allowNull: false,
    regex: null,
    label: '戶籍村里',
    messages: {
      missing: '你的戶籍在哪個村里？'
    }
  }
}
