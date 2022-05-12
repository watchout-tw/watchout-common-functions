export const privateInfo = {
  name: {
    allowNull: false,
    regex: null,
    label: '真實姓名',
    messages: {
      missing: '你的名字？'
    }
  },
  nickname: {
    allowNull: true,
    regex: null,
    label: '暱稱',
    messages: {
      missing: '你的暱稱？'
    }
  },
  company_name: {
    allowNull: true,
    regex: null,
    label: '公司名稱',
    messages: {
      missing: '公司名稱？'
    }
  },
  company_identifier: {
    allowNull: true,
    regex: null,
    label: '統一編號',
    messages: {
      missing: '統一編號？'
    }
  },
  invoice_type: {
    allowNull: true,
    regex: null,
    label: '發票類型',
    messages: {
      missing: '發票類型？'
    }
  },
  invoice_code: {
    allowNull: true,
    regex: null,
    label: '載具編號',
    messages: {
      missing: '載具編號？'
    }
  },
  birth_year: {
    allowNull: false,
    regex: null,
    label: '出生年',
    messages: {
      missing: '你的出生年？'
    }
  },
  birth_month: {
    allowNull: false,
    regex: null,
    label: '月',
    messages: {
      missing: '你的出生月？'
    }
  },
  birth_date: {
    allowNull: false,
    regex: null,
    label: '日',
    messages: {
      missing: '你的出生日？'
    }
  },
  country_code: {
    allowNull: false,
    regex: null,
    label: '國碼',
    messages: {
      missing: '國碼？'
    }
  },
  phone_number: {
    allowNull: false,
    regex: null,
    label: '行動電話',
    messages: {
      missing: '行動電話？'
    }
  },
  gender: {
    allowNull: false,
    regex: null,
    label: '性別',
    messages: {
      missing: '你的性別？'
    }
  },
  receiver_zipcode_prefix: {
    allowNull: false,
    regex: null,
    label: '郵遞區號前三碼',
    messages: {
      missing: '郵遞區號前三碼？'
    }
  },
  receiver_zipcode_suffix: {
    allowNull: false,
    regex: /^\d{2,3}$/,
    label: '郵遞區號後三碼',
    messages: {
      missing: '郵遞區號後三碼？',
      regexError: '郵遞區號格式錯誤'
    }
  },
  receiver_city: {
    allowNull: false,
    regex: null,
    label: '居住城市',
    messages: {
      missing: '居住城市？'
    }
  },
  receiver_district: {
    allowNull: false,
    regex: null,
    label: '居住區域',
    messages: {
      missing: '居住區域？'
    }
  },
  receiver_street: {
    allowNull: false,
    regex: null,
    label: '居住街道',
    messages: {
      missing: '居住街道？'
    }
  },
  voter_type: {
    allowNull: false,
    regex: null,
    label: '投票人類別',
    messages: {
      missing: '投票人類別？'
    }
  },
  voter_city: {
    allowNull: false,
    regex: null,
    label: '戶籍城市',
    messages: {
      missing: '戶籍城市？'
    }
  },
  voter_district: {
    allowNull: false,
    regex: null,
    label: '戶籍區域',
    messages: {
      missing: '戶籍區域？'
    }
  },
  voter_neighborhood: {
    allowNull: false,
    regex: null,
    label: '戶籍村里',
    messages: {
      missing: '戶籍村里？'
    }
  }
}
