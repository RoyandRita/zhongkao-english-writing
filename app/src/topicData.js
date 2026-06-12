// ─────────────────────────────────────────────────────────────────────────────
// TOPIC DATA — 5 topics with 9-10 sentences each + discovery mode A/B pairs
// ─────────────────────────────────────────────────────────────────────────────

const TOPICS = [
  {
    "id": 1,
    "year": "2023仿写",
    "title": "My Favourite Season",
    "emoji": "🌸",
    "theme": "描写最喜欢的季节及原因",
    "color": "#f0fdf4",
    "accent": "#16a34a",
    "light": "#dcfce7",
    "opening": "Different people like different seasons.",
    "sentences": [
      {
        "id": 2,
        "role": "主题句",
        "chainType": "argument",
        "tip": "点明最喜欢的季节 + 一个核心感受词（refreshing / lively / cosy）。避免只说'I like spring'，需加 because 或 for me 引入原因。",
        "vocab": [
          "spring, summer, autumn, winter",
          "refreshing, lively, golden, crisp, cosy",
          "favourite, prefer, above all others"
        ],
        "patterns": [
          "My favourite season is ___, because it always makes me feel ___.",
          "Of all four seasons, I love ___ most, for it is both ___ and ___."
        ],
        "grammar": "一般现在时 + 形容词表语；because / for 引出原因",
        "discovery": {
          "a": {
            "text": "To me, spring stands out clearly above all other seasons, filling my heart with excitement and energy every single year.",
            "highlights": [
              {
                "start": 0,
                "end": 2,
                "label": "To me 引出观点 — 避免模板化'I like'开头",
                "type": "connector"
              },
              {
                "start": 25,
                "end": 42,
                "label": "副词 clearly + 比较级 above all — 强调独特性",
                "type": "adverb"
              },
              {
                "start": 58,
                "end": 75,
                "label": "非谓语 filling... — 伴随状语，补充心理感受",
                "type": "non-finite"
              },
              {
                "start": 80,
                "end": 101,
                "label": "具象感受词 excitement + energy — 双重情感描写",
                "type": "concrete-feeling"
              }
            ]
          },
          "b": {
            "text": "My favourite season is spring, which always greets me with warm breezes, blooming gardens, and a fresh sense of hope.",
            "highlights": [
              {
                "start": 0,
                "end": 22,
                "label": "My favourite...is 直接点题 — 简洁有力",
                "type": "connector"
              },
              {
                "start": 29,
                "end": 59,
                "label": "非限定定语从句 , which... — 补充春天的特征",
                "type": "non-restrictive"
              },
              {
                "start": 59,
                "end": 89,
                "label": "具象名词连排 warm breezes + blooming gardens — 画面感",
                "type": "concrete-imagery"
              },
              {
                "start": 95,
                "end": 116,
                "label": "具象感受 a fresh sense of hope — 新鲜感 + 希望",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 3,
        "role": "景色描写",
        "chainType": "imagery",
        "tip": "用2-3个感官细节（视觉/嗅觉/触觉）描绘该季节自然景象。运用 there be 或 when 状语从句增加层次感。",
        "vocab": [
          "blossom, bloom, fade, rustle",
          "breeze, sunshine, mist, golden leaves",
          "everywhere, gently, softly, vividly"
        ],
        "patterns": [
          "There are ___ everywhere, and the air smells of ___.",
          "When ___, the whole world seems to ___."
        ],
        "grammar": "there be 句型；when 引导时间状语从句",
        "discovery": {
          "a": {
            "text": "Walking gently through the park, you can vividly see cherry blossoms dancing in the warm breeze and smell fresh flowers everywhere.",
            "highlights": [
              {
                "start": 0,
                "end": 31,
                "label": "非谓语 Walking... — 以动作引入场景",
                "type": "non-finite"
              },
              {
                "start": 8,
                "end": 14,
                "label": "副词 gently — 动作的方式感",
                "type": "adverb"
              },
              {
                "start": 41,
                "end": 52,
                "label": "副词 vividly + 感官动词 see — 强化视觉描写",
                "type": "adverb"
              },
              {
                "start": 53,
                "end": 95,
                "label": "具象画面 cherry blossoms dancing — 动态画面感",
                "type": "concrete-imagery"
              },
              {
                "start": 100,
                "end": 130,
                "label": "具体感官细节 smell fresh flowers — 嗅觉层次",
                "type": "concrete-imagery"
              }
            ]
          },
          "b": {
            "text": "Everywhere you look, pink and white blossoms cover the trees like a soft blanket, which makes the whole world feel gentle and alive.",
            "highlights": [
              {
                "start": 21,
                "end": 60,
                "label": "具象色彩 pink and white blossoms — 颜色画面",
                "type": "concrete-imagery"
              },
              {
                "start": 61,
                "end": 80,
                "label": "比喻 like a soft blanket — 触觉意象",
                "type": "concrete-imagery"
              },
              {
                "start": 80,
                "end": 131,
                "label": "非限定定语从句 , which makes... — 补充景色的整体效果",
                "type": "non-restrictive"
              },
              {
                "start": 115,
                "end": 131,
                "label": "感受形容词 gentle + alive — 世界有了生命感",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 4,
        "role": "户外活动",
        "chainType": "causality",
        "tip": "写一项该季节特有的户外活动，加频率副词（often/always）和具体地点，使场景真实可信。",
        "vocab": [
          "go hiking, fly kites, go skating, pick fruits",
          "park, countryside, riverside, mountain",
          "often, always, whenever possible"
        ],
        "patterns": [
          "I often ___ with my family in the ___, enjoying every moment.",
          "Whenever ___ comes, I can't wait to ___ in the open air."
        ],
        "grammar": "频率副词位置；can't wait to do 表迫切",
        "discovery": {
          "a": {
            "text": "I often fly kites enthusiastically with my family in the open park, laughing and running freely across the wide green field.",
            "highlights": [
              {
                "start": 0,
                "end": 34,
                "label": "频率副词 often — 建立习惯感",
                "type": "adverb"
              },
              {
                "start": 18,
                "end": 34,
                "label": "副词 enthusiastically — 动作的情感色彩",
                "type": "adverb"
              },
              {
                "start": 68,
                "end": 123,
                "label": "非谓语 laughing and running... — 伴随动作，画面流动",
                "type": "non-finite"
              },
              {
                "start": 89,
                "end": 95,
                "label": "副词 freely — 自由感",
                "type": "adverb"
              },
              {
                "start": 107,
                "end": 123,
                "label": "具体地点 wide green field — 空间画面",
                "type": "specific-detail"
              }
            ]
          },
          "b": {
            "text": "Whenever spring arrives, I can't wait to fly colourful kites in the riverside park, which has become our family's most beloved weekend tradition.",
            "highlights": [
              {
                "start": 0,
                "end": 23,
                "label": "Whenever 时间从句 — 建立情境感",
                "type": "connector"
              },
              {
                "start": 27,
                "end": 44,
                "label": "can't wait to 迫切表达 — 情感强烈",
                "type": "connector"
              },
              {
                "start": 45,
                "end": 82,
                "label": "具象形容词 colourful kites + 具体地点 riverside park",
                "type": "concrete-imagery"
              },
              {
                "start": 82,
                "end": 111,
                "label": "非限定定语从句 , which has become... — 补充活动的意义",
                "type": "non-restrictive"
              },
              {
                "start": 114,
                "end": 144,
                "label": "形容词 beloved + tradition — 情感具象化",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 5,
        "role": "另一活动/节日",
        "chainType": "causality",
        "tip": "引入室内活动或节日场景，用 Besides / In addition / What's more 与上句衔接，体现丰富性。",
        "vocab": [
          "besides, in addition, what's more, moreover",
          "celebrate, gather, decorate, prepare",
          "traditional, joyful, cosy, meaningful"
        ],
        "patterns": [
          "Besides ___, I also love ___, which brings the whole family together.",
          "What's more, ___ is a season when people ___ and share ___."
        ],
        "grammar": "连接副词 + 逗号；when 引导定语从句",
        "discovery": {
          "a": {
            "text": "Besides outdoor fun, I also truly enjoy preparing traditional spring dishes together with my grandmother, carefully wrapping each dumpling by hand.",
            "highlights": [
              {
                "start": 0,
                "end": 19,
                "label": "Besides 连接副词 — 自然衔接上文",
                "type": "connector"
              },
              {
                "start": 28,
                "end": 39,
                "label": "副词 truly + enjoy — 强化真实情感",
                "type": "adverb"
              },
              {
                "start": 40,
                "end": 104,
                "label": "非谓语 preparing... — 具体活动内容",
                "type": "non-finite"
              },
              {
                "start": 106,
                "end": 146,
                "label": "副词 carefully + 方式短语 by hand — 动作细节",
                "type": "adverb"
              },
              {
                "start": 50,
                "end": 75,
                "label": "具象形容词 traditional spring dishes — 文化细节",
                "type": "concrete-imagery"
              }
            ]
          },
          "b": {
            "text": "What's more, spring is a season when our whole family gathers cosily around the table, sharing warm stories and delicious food that my grandmother prepares with love.",
            "highlights": [
              {
                "start": 0,
                "end": 11,
                "label": "What's more 递进衔接 — 引入新层次",
                "type": "connector"
              },
              {
                "start": 32,
                "end": 61,
                "label": "when 定语从句 — 修饰 season，具体化时间",
                "type": "connector"
              },
              {
                "start": 62,
                "end": 85,
                "label": "副词 cosily — 温暖的氛围感",
                "type": "adverb"
              },
              {
                "start": 95,
                "end": 126,
                "label": "具象画面 warm stories + delicious food — 感官叠加",
                "type": "concrete-imagery"
              },
              {
                "start": 156,
                "end": 165,
                "label": "that 定语从句 + with love — 情感细节",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 6,
        "role": "情感深化",
        "chainType": "imagery",
        "tip": "写该季节带给你的心理感受或精神力量，用 make sb. feel 或比较级强调独特性，避免空洞。",
        "vocab": [
          "relaxed, energetic, hopeful, inspired, peaceful",
          "make me feel / remind me of / fill me with",
          "more ... than any other, the most ... of all"
        ],
        "patterns": [
          "___ always fills me with ___ and makes me feel ready to ___.",
          "No other season can ___ like ___ does, which is why I love it so much."
        ],
        "grammar": "make + 宾语 + 形容词；which 非限制性定语从句",
        "discovery": {
          "a": {
            "text": "Spring always completely fills me with energy and makes me feel genuinely ready to take on any challenge bravely.",
            "highlights": [
              {
                "start": 7,
                "end": 45,
                "label": "频率副词 always — 持续的情感",
                "type": "adverb"
              },
              {
                "start": 14,
                "end": 24,
                "label": "副词 completely — 程度强化，填满感",
                "type": "adverb"
              },
              {
                "start": 25,
                "end": 45,
                "label": "Change核动词 fills me with — 情感注入",
                "type": "change-verb"
              },
              {
                "start": 64,
                "end": 79,
                "label": "副词 genuinely — 真实的感受",
                "type": "adverb"
              },
              {
                "start": 80,
                "end": 112,
                "label": "非谓语 to take on... + 副词 bravely — 行动导向",
                "type": "non-finite"
              }
            ]
          },
          "b": {
            "text": "No other season can refresh my mind and lift my spirits quite like spring does, which is exactly why I treasure every single moment of it.",
            "highlights": [
              {
                "start": 0,
                "end": 19,
                "label": "No other...can 比较级强调 — 独特性",
                "type": "connector"
              },
              {
                "start": 20,
                "end": 55,
                "label": "Change核动词 refresh + lift — 精神层面的变化",
                "type": "change-verb"
              },
              {
                "start": 78,
                "end": 100,
                "label": "非限定定语从句 , which is exactly why... — 补充结论",
                "type": "non-restrictive"
              },
              {
                "start": 103,
                "end": 131,
                "label": "Mind核动词 treasure — 珍惜的情感深度",
                "type": "mind-verb"
              },
              {
                "start": 112,
                "end": 131,
                "label": "具象表达 every single moment — 强调每一刻",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 7,
        "role": "转折让步",
        "chainType": "contrast",
        "tip": "诚实承认该季节一个小缺点，随即用 however / even so 转折，体现辩证思维和真实感。",
        "vocab": [
          "although, though, even if, admittedly",
          "hot, cold, rainy, windy, unpredictable",
          "bother, mind, worth it, outweigh"
        ],
        "patterns": [
          "Although ___ can sometimes be ___, I don't mind at all because ___.",
          "Admittedly, ___ brings ___, but the joy it offers far outweighs any discomfort."
        ],
        "grammar": "although 让步从句；far outweighs 比较表达",
        "discovery": {
          "a": {
            "text": "Although spring can sometimes be unexpectedly rainy, I honestly don't mind at all because the refreshing smell of wet earth afterwards completely makes up for it.",
            "highlights": [
              {
                "start": 0,
                "end": 29,
                "label": "Although 让步从句 — 承认缺点",
                "type": "connector"
              },
              {
                "start": 33,
                "end": 51,
                "label": "副词 unexpectedly — 意外的程度",
                "type": "adverb"
              },
              {
                "start": 55,
                "end": 63,
                "label": "副词 honestly — 诚实的态度",
                "type": "adverb"
              },
              {
                "start": 94,
                "end": 123,
                "label": "具象感官 refreshing smell of wet earth — 嗅觉画面",
                "type": "concrete-imagery"
              },
              {
                "start": 135,
                "end": 161,
                "label": "副词 completely — 彻底弥补",
                "type": "adverb"
              }
            ]
          },
          "b": {
            "text": "Admittedly, spring brings occasional rainy days that may seem disappointing, but the fresh, clean world that follows them, which sparkles with raindrops, far outweighs any discomfort.",
            "highlights": [
              {
                "start": 0,
                "end": 25,
                "label": "Admittedly 让步副词 — 先承认再转折",
                "type": "connector"
              },
              {
                "start": 26,
                "end": 47,
                "label": "形容词 occasional + disappointing — 诚实但不负面",
                "type": "adverb"
              },
              {
                "start": 85,
                "end": 103,
                "label": "形容词 fresh, clean — 转折后的画面",
                "type": "concrete-imagery"
              },
              {
                "start": 121,
                "end": 152,
                "label": "非限定定语从句 , which sparkles... — 闪光画面",
                "type": "non-restrictive"
              },
              {
                "start": 129,
                "end": 152,
                "label": "具象动词 sparkles with raindrops — 视觉美感",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 8,
        "role": "具体回忆",
        "chainType": "causality",
        "tip": "用过去时讲一次个人亲身经历（某天/某年），有起因结果和情感，使文章生动立体。",
        "vocab": [
          "I still remember, once, last year, one afternoon",
          "unforgettable, magical, precious, moving",
          "I felt / I was thrilled / I will never forget"
        ],
        "patterns": [
          "I still remember the time when ___, and I felt so ___ that I never forgot it.",
          "Once, ___ happened during ___, which turned out to be one of the most ___ moments of my life."
        ],
        "grammar": "过去时叙事；定语从句 + 强调结构",
        "discovery": {
          "a": {
            "text": "I still remember clearly one spring afternoon when I discovered a hidden garden full of butterflies, and I stood there silently, completely lost in its magical beauty.",
            "highlights": [
              {
                "start": 0,
                "end": 24,
                "label": "I still remember 叙事开场 — 过去时引入",
                "type": "connector"
              },
              {
                "start": 17,
                "end": 45,
                "label": "副词 clearly — 记忆的清晰度",
                "type": "adverb"
              },
              {
                "start": 46,
                "end": 99,
                "label": "when 定语从句 + 具象画面 hidden garden + butterflies",
                "type": "concrete-imagery"
              },
              {
                "start": 119,
                "end": 144,
                "label": "副词 silently + completely — 安静和沉浸",
                "type": "adverb"
              },
              {
                "start": 152,
                "end": 166,
                "label": "具象感受 magical beauty — 情感画面",
                "type": "concrete-feeling"
              }
            ]
          },
          "b": {
            "text": "Once, I spent an entire afternoon wandering through a cherry blossom garden near my home, which turned out to be the most peaceful and unforgettable moment of my entire spring.",
            "highlights": [
              {
                "start": 0,
                "end": 33,
                "label": "Once 叙事信号 — 过去经历",
                "type": "connector"
              },
              {
                "start": 17,
                "end": 33,
                "label": "具象时间 entire afternoon — 投入的时间",
                "type": "specific-detail"
              },
              {
                "start": 54,
                "end": 88,
                "label": "具体地点 cherry blossom garden near my home — 真实场景",
                "type": "concrete-imagery"
              },
              {
                "start": 88,
                "end": 148,
                "label": "非限定定语从句 , which turned out... — 补充结果和评价",
                "type": "non-restrictive"
              },
              {
                "start": 122,
                "end": 155,
                "label": "形容词 peaceful + unforgettable — 双重感受",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 9,
        "role": "升华感悟",
        "chainType": "time-layer",
        "tip": "由个人经历上升到普遍意义——季节对人的启示或人与自然的关系，提升立意层次。",
        "vocab": [
          "teaches, reminds, encourages, inspires",
          "appreciate, cherish, value, treasure",
          "the beauty of life, the power of nature, gratitude"
        ],
        "patterns": [
          "___ teaches me to appreciate ___ and cherish every ___ moment.",
          "I believe ___ is nature's way of reminding us to ___ and be grateful for ___."
        ],
        "grammar": "teach/remind sb. to do；I believe that 宾语从句",
        "discovery": {
          "a": {
            "text": "Spring gently teaches me to appreciate the simple beauty of nature and patiently reminds me that life always renews itself after every cold winter.",
            "highlights": [
              {
                "start": 0,
                "end": 24,
                "label": "副词 gently + teaches — 温柔地教会",
                "type": "adverb"
              },
              {
                "start": 25,
                "end": 66,
                "label": "非谓语 to appreciate... — 教会的内容",
                "type": "non-finite"
              },
              {
                "start": 43,
                "end": 66,
                "label": "具象表达 simple beauty of nature — 自然之美",
                "type": "concrete-feeling"
              },
              {
                "start": 71,
                "end": 91,
                "label": "副词 patiently — 耐心的提醒",
                "type": "adverb"
              },
              {
                "start": 81,
                "end": 122,
                "label": "Mind核动词 reminds + 宾语从句 — 深层感悟",
                "type": "mind-verb"
              }
            ]
          },
          "b": {
            "text": "I truly believe that spring is nature's most beautiful way of reminding us to slow down, breathe deeply, and notice the tiny wonders that surround us every single day.",
            "highlights": [
              {
                "start": 0,
                "end": 30,
                "label": "I truly believe that 宾语从句 — 观点引出",
                "type": "object-clause"
              },
              {
                "start": 2,
                "end": 15,
                "label": "副词 truly — 真诚地相信",
                "type": "adverb"
              },
              {
                "start": 31,
                "end": 58,
                "label": "最高级 most beautiful + 具象 way of reminding",
                "type": "concrete-imagery"
              },
              {
                "start": 75,
                "end": 103,
                "label": "非谓语 to slow down, breathe deeply — 具体行动链",
                "type": "non-finite"
              },
              {
                "start": 120,
                "end": 149,
                "label": "具象表达 tiny wonders — 微小奇迹",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 10,
        "role": "结论收尾",
        "chainType": "time-layer",
        "tip": "呼应开头，换新词汇重申主旨，加展望或邀请读者共鸣，结尾有力不拖沓。",
        "vocab": [
          "In a word, To sum up, That is why",
          "look forward to, cherish, count down to",
          "every single year, year after year"
        ],
        "patterns": [
          "In a word, ___ is more than just a season to me — it is ___.",
          "That is why, year after year, I always look forward to ___ with the same joy."
        ],
        "grammar": "In a word 总结；more than 升华表达",
        "discovery": {
          "a": {
            "text": "To sum up, spring is far more than just a season to me — it is a yearly reminder to live hopefully and embrace every fresh beginning wholeheartedly.",
            "highlights": [
              {
                "start": 0,
                "end": 39,
                "label": "To sum up 总结信号 — 收束全文",
                "type": "connector"
              },
              {
                "start": 21,
                "end": 34,
                "label": "far more than 比较级 — 升华表达",
                "type": "connector"
              },
              {
                "start": 81,
                "end": 132,
                "label": "非谓语 to live hopefully — 生活态度的总结",
                "type": "non-finite"
              },
              {
                "start": 133,
                "end": 147,
                "label": "副词 wholeheartedly — 全心全意",
                "type": "adverb"
              },
              {
                "start": 89,
                "end": 110,
                "label": "副词 hopefully — 希望的态度",
                "type": "adverb"
              }
            ]
          },
          "b": {
            "text": "That is why, year after year, I find myself counting down the days until spring returns, bringing with it a world of colour, warmth, and endless possibilities.",
            "highlights": [
              {
                "start": 0,
                "end": 28,
                "label": "That is why 因果总结 — 呼应前文",
                "type": "connector"
              },
              {
                "start": 13,
                "end": 28,
                "label": "year after year 时间重复 — 强调持续",
                "type": "adverb"
              },
              {
                "start": 89,
                "end": 158,
                "label": "非谓语 bringing with it... — 春天带回来的画面",
                "type": "non-finite"
              },
              {
                "start": 117,
                "end": 158,
                "label": "具象名词连排 colour, warmth, endless possibilities — 三重叠进",
                "type": "concrete-imagery"
              },
              {
                "start": 137,
                "end": 158,
                "label": "具象表达 endless possibilities — 无限可能",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "id": 2,
    "year": "2022仿写",
    "title": "My Best Friend",
    "emoji": "🤝",
    "theme": "介绍最好的朋友及你们的友谊",
    "color": "#eff6ff",
    "accent": "#1d4ed8",
    "light": "#dbeafe",
    "opening": "Everyone needs a good friend in life.",
    "sentences": [
      {
        "id": 2,
        "role": "引出人物",
        "chainType": "argument",
        "tip": "介绍朋友姓名+年龄+一个最鲜明的外貌或性格特征，用 who/whose 定语从句增加信息量，避免流水账。",
        "vocab": [
          "called, named, whose name is",
          "tall, slim, energetic, cheerful, thoughtful",
          "who is / whose eyes / with a warm smile"
        ],
        "patterns": [
          "My best friend is ___, a ___ girl/boy with ___, who always ___.",
          "I have a best friend called ___, whose ___ immediately catches everyone's attention."
        ],
        "grammar": "who / whose 定语从句；名词短语作同位语",
        "discovery": {
          "a": {
            "text": "My best friend is Li Hua, a cheerful and thoughtful boy whose warm smile immediately puts everyone around him completely at ease.",
            "highlights": [
              {
                "start": 0,
                "end": 16,
                "label": "直接点题 + 同位语 a cheerful...boy — 信息丰富",
                "type": "connector"
              },
              {
                "start": 17,
                "end": 49,
                "label": "形容词 cheerful + thoughtful — 双重性格",
                "type": "concrete-imagery"
              },
              {
                "start": 50,
                "end": 80,
                "label": "whose 定语从句 — 描写外貌特征",
                "type": "connector"
              },
              {
                "start": 68,
                "end": 77,
                "label": "副词 immediately — 立刻的效果",
                "type": "adverb"
              },
              {
                "start": 90,
                "end": 107,
                "label": "副词 completely + 短语 at ease — 彻底放松",
                "type": "adverb"
              }
            ]
          },
          "b": {
            "text": "I have a best friend called Li Hua, whose bright eyes and ready smile, which never fail to light up any room, make him the kindest person I have ever known.",
            "highlights": [
              {
                "start": 0,
                "end": 23,
                "label": "I have a best friend called... 自然引入",
                "type": "connector"
              },
              {
                "start": 24,
                "end": 57,
                "label": "whose 定语从句 + 具象描写 bright eyes + ready smile",
                "type": "concrete-imagery"
              },
              {
                "start": 58,
                "end": 95,
                "label": "非限定定语从句 , which never fail... — 补充说明",
                "type": "non-restrictive"
              },
              {
                "start": 75,
                "end": 90,
                "label": "具象动词 light up any room — 画面感",
                "type": "concrete-imagery"
              },
              {
                "start": 96,
                "end": 115,
                "label": "最高级 the kindest person — 强调",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 3,
        "role": "性格特点",
        "chainType": "argument",
        "tip": "写2-3个性格词，每个紧接具体行为表现（he always / she never），让性格可感可信。",
        "vocab": [
          "generous, patient, honest, reliable, humorous",
          "always, never, whenever, no matter what",
          "I admire / appreciate / look up to"
        ],
        "patterns": [
          "What I admire most about ___ is that she/he is always ___, even when ___.",
          "She/He never ___, which makes her/him the most ___ person I have ever known."
        ],
        "grammar": "What 主语从句；even when 让步；which 非限制性",
        "discovery": {
          "a": {
            "text": "What I admire most deeply about Li Hua is that he always listens patiently to others, even when he is busy himself.",
            "highlights": [
              {
                "start": 0,
                "end": 10,
                "label": "What 主语从句 — 强调最欣赏的品质",
                "type": "connector"
              },
              {
                "start": 10,
                "end": 22,
                "label": "副词 deeply — 深度的欣赏",
                "type": "adverb"
              },
              {
                "start": 35,
                "end": 54,
                "label": "副词 always + patiently — 持续且耐心的行为",
                "type": "adverb"
              },
              {
                "start": 55,
                "end": 76,
                "label": "even when 让步 — 即使自己忙也倾听",
                "type": "connector"
              }
            ]
          },
          "b": {
            "text": "Li Hua is the most generous and honest person I know, who never hesitates to share whatever he has with friends in need, which has earned him everyone's trust and respect.",
            "highlights": [
              {
                "start": 0,
                "end": 31,
                "label": "最高级 + 性格词 generous + honest — 双重品质",
                "type": "concrete-feeling"
              },
              {
                "start": 32,
                "end": 40,
                "label": "I know 定语从句 — 个人见证",
                "type": "connector"
              },
              {
                "start": 41,
                "end": 79,
                "label": "who 定语从句 + 具体行为 share whatever he has",
                "type": "concrete-imagery"
              },
              {
                "start": 80,
                "end": 120,
                "label": "非限定定语从句 , which has earned... — 结果和影响",
                "type": "non-restrictive"
              },
              {
                "start": 100,
                "end": 120,
                "label": "具象名词 trust + respect — 赢得的品质",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 4,
        "role": "共同爱好",
        "chainType": "causality",
        "tip": "写你们共有的兴趣，用 both...and 或 share a passion for，强调 '共同' 而非单独描写一人。",
        "vocab": [
          "both...and, share, have in common",
          "passion for, interest in, fond of, crazy about",
          "basketball, reading, music, cooking, gaming"
        ],
        "patterns": [
          "We both ___ and often spend hours ___ together, completely forgetting the time.",
          "We share a deep passion for ___, which has brought us countless ___ memories."
        ],
        "grammar": "both...and 并列；which 引出结果从句",
        "discovery": {
          "a": {
            "text": "We both love playing basketball passionately and often spend entire afternoons together on the court, completely losing track of time.",
            "highlights": [
              {
                "start": 0,
                "end": 7,
                "label": "We both 并列 — 强调共同性",
                "type": "connector"
              },
              {
                "start": 8,
                "end": 24,
                "label": "非谓语 playing basketball — 爱好内容",
                "type": "non-finite"
              },
              {
                "start": 25,
                "end": 36,
                "label": "副词 passionately — 热爱程度",
                "type": "adverb"
              },
              {
                "start": 40,
                "end": 72,
                "label": "副词 often + 具体时间 entire afternoons + 地点 on the court",
                "type": "specific-detail"
              },
              {
                "start": 73,
                "end": 93,
                "label": "非谓语 losing track of time — 投入忘我",
                "type": "non-finite"
              }
            ]
          },
          "b": {
            "text": "We share a deep passion for basketball, which has brought us countless unforgettable afternoons of laughter, teamwork, and friendly competition on the sunny court.",
            "highlights": [
              {
                "start": 0,
                "end": 7,
                "label": "We share 共同拥有 — 友谊的核心",
                "type": "connector"
              },
              {
                "start": 11,
                "end": 15,
                "label": "形容词 deep — 深刻的热情",
                "type": "adverb"
              },
              {
                "start": 43,
                "end": 88,
                "label": "非限定定语从句 , which has brought... — 篮球带来的结果",
                "type": "non-restrictive"
              },
              {
                "start": 65,
                "end": 96,
                "label": "具象名词连排 laughter, teamwork, friendly competition — 三重画面",
                "type": "concrete-imagery"
              },
              {
                "start": 96,
                "end": 108,
                "label": "具象地点 sunny court — 阳光下的球场",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 5,
        "role": "难忘经历",
        "chainType": "causality",
        "tip": "过去时讲一次具体的共同经历：有背景、转折和情感反应。It was...who 强调句可提分。",
        "vocab": [
          "I remember, once, one rainy afternoon",
          "helped, supported, encouraged, cheered up",
          "I felt / I was deeply moved / I will never forget"
        ],
        "patterns": [
          "I remember the time when ___, and it was ___ who ___ without a moment's hesitation.",
          "Once, when I was ___, she/he ___, which meant the world to me."
        ],
        "grammar": "It was...who 强调句；when 定语从句",
        "discovery": {
          "a": {
            "text": "I clearly remember the time when I failed an important exam, and it was Li Hua who sat beside me quietly, encouraging me patiently until I smiled again.",
            "highlights": [
              {
                "start": 0,
                "end": 17,
                "label": "副词 clearly + remember — 清晰的记忆",
                "type": "adverb"
              },
              {
                "start": 18,
                "end": 48,
                "label": "when 定语从句 — 具体事件",
                "type": "connector"
              },
              {
                "start": 49,
                "end": 66,
                "label": "It was...who 强调句 — 强调是李华",
                "type": "connector"
              },
              {
                "start": 67,
                "end": 88,
                "label": "副词 quietly + patiently — 安静耐心的陪伴",
                "type": "adverb"
              },
              {
                "start": 89,
                "end": 105,
                "label": "非谓语 encouraging me — 持续鼓励直到我恢复",
                "type": "non-finite"
              }
            ]
          },
          "b": {
            "text": "Once, when I felt completely defeated by a terrible exam score, Li Hua stayed with me for hours, sharing his own past struggles and reminding me that failure is just a stepping stone to success.",
            "highlights": [
              {
                "start": 0,
                "end": 4,
                "label": "Once 叙事信号 + when 时间从句",
                "type": "connector"
              },
              {
                "start": 12,
                "end": 30,
                "label": "副词 completely + 具象形容词 terrible — 真实情感",
                "type": "adverb"
              },
              {
                "start": 75,
                "end": 104,
                "label": "非谓语 sharing... + reminding... — 双动作展现支持",
                "type": "non-finite"
              },
              {
                "start": 85,
                "end": 104,
                "label": "具象名词 past struggles — 分享自己的经历",
                "type": "concrete-imagery"
              },
              {
                "start": 105,
                "end": 125,
                "label": "具象比喻 stepping stone to success — 深刻的安慰",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 6,
        "role": "朋友的影响",
        "chainType": "argument",
        "tip": "写朋友如何改变或提升了你，用 Thanks to / Because of 或现在完成时表持续影响。",
        "vocab": [
          "thanks to, because of, owing to",
          "inspired, encouraged, motivated, guided",
          "become more, learn to, grow into"
        ],
        "patterns": [
          "Thanks to ___, I have become more ___ and learned to ___.",
          "Because of her/his influence, I have gradually ___, which has made me a better person."
        ],
        "grammar": "Thanks to 介词短语；现在完成时表持续影响",
        "discovery": {
          "a": {
            "text": "Thanks to his patient encouragement, I have gradually become more confident and learned to face challenges bravely instead of giving up.",
            "highlights": [
              {
                "start": 0,
                "end": 9,
                "label": "Thanks to 因果介词 — 归功于",
                "type": "connector"
              },
              {
                "start": 10,
                "end": 22,
                "label": "形容词 patient + 名词 encouragement — 品质具体化",
                "type": "concrete-feeling"
              },
              {
                "start": 31,
                "end": 52,
                "label": "副词 gradually + Change核 become — 渐进变化",
                "type": "change-verb"
              },
              {
                "start": 53,
                "end": 77,
                "label": "副词 bravely — 勇敢的态度",
                "type": "adverb"
              },
              {
                "start": 78,
                "end": 99,
                "label": "非谓语 instead of giving up — 对比旧习惯",
                "type": "non-finite"
              }
            ]
          },
          "b": {
            "text": "His constant support and wise advice, which have never failed to guide me through difficult moments, have gradually shaped me into a stronger and more hopeful person.",
            "highlights": [
              {
                "start": 3,
                "end": 30,
                "label": "具象名词 constant support + wise advice — 两种帮助",
                "type": "concrete-imagery"
              },
              {
                "start": 31,
                "end": 82,
                "label": "非限定定语从句 , which have never failed... — 补充影响",
                "type": "non-restrictive"
              },
              {
                "start": 56,
                "end": 82,
                "label": "具象动词 guide me through difficult moments",
                "type": "concrete-imagery"
              },
              {
                "start": 87,
                "end": 106,
                "label": "副词 gradually + Change核 shaped — 塑造的过程",
                "type": "change-verb"
              },
              {
                "start": 107,
                "end": 127,
                "label": "形容词 stronger + hopeful — 成长的双重结果",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 7,
        "role": "真友谊的内涵",
        "chainType": "time-layer",
        "tip": "上升到你对'真正友谊'的理解，用一个比喻或转折，展示思想深度，避免口号化。",
        "vocab": [
          "true friendship, genuine, precious, irreplaceable",
          "a treasure, a mirror, a lighthouse",
          "trust, support, understand, forgive, grow together"
        ],
        "patterns": [
          "True friendship, I believe, is not about ___, but about ___.",
          "To me, a real friend is someone who ___ even when ___, and that is exactly what ___ is."
        ],
        "grammar": "not...but 转折对比；someone who 定语从句；插入语 I believe",
        "discovery": {
          "a": {
            "text": "True friendship, I have slowly come to understand, is not about always agreeing with each other, but about standing firmly by each other when things get difficult.",
            "highlights": [
              {
                "start": 0,
                "end": 17,
                "label": "主语 + 插入语 I have...understand — 思考过程",
                "type": "connector"
              },
              {
                "start": 17,
                "end": 31,
                "label": "副词 slowly — 逐渐理解的过程",
                "type": "adverb"
              },
              {
                "start": 40,
                "end": 77,
                "label": "not about...but about... 对比结构 — 核心见解",
                "type": "connector"
              },
              {
                "start": 62,
                "end": 77,
                "label": "非谓语 standing firmly by — 坚定的支持",
                "type": "non-finite"
              },
              {
                "start": 58,
                "end": 63,
                "label": "副词 firmly — 坚定的态度",
                "type": "adverb"
              }
            ]
          },
          "b": {
            "text": "A true friend, I believe, is like a warm lighthouse on a dark night — someone who guides you safely home, whose steady light never dims even in the stormiest weather.",
            "highlights": [
              {
                "start": 0,
                "end": 12,
                "label": "A true friend 主题 + I believe 插入语 — 观点表达",
                "type": "connector"
              },
              {
                "start": 12,
                "end": 38,
                "label": "比喻 like a warm lighthouse — 具象化友谊",
                "type": "concrete-imagery"
              },
              {
                "start": 28,
                "end": 38,
                "label": "形容词 warm + dark 对比画面",
                "type": "concrete-imagery"
              },
              {
                "start": 39,
                "end": 60,
                "label": "who 定语从句 — 指引回家",
                "type": "connector"
              },
              {
                "start": 61,
                "end": 100,
                "label": "whose 定语从句 — 光线不灭，比喻友谊持久",
                "type": "non-restrictive"
              }
            ]
          }
        }
      },
      {
        "id": 8,
        "role": "现状近况",
        "chainType": "causality",
        "tip": "交代目前联系方式或近况，时态从过去切换回现在，体现时态灵活运用。",
        "vocab": [
          "stay in touch, keep in contact, remain close",
          "chat, call, meet up, text",
          "still, continue to, as always, to this day"
        ],
        "patterns": [
          "Although we are now in different schools, we still ___ and ___ whenever we can.",
          "To this day, we ___ regularly, always finding something new to ___ about."
        ],
        "grammar": "Although 让步 + 现在时；regularly 频率副词",
        "discovery": {
          "a": {
            "text": "Although we now attend different schools, we still stay closely in touch, regularly calling each other to share our latest news and laugh together.",
            "highlights": [
              {
                "start": 0,
                "end": 8,
                "label": "Although 让步 — 尽管在不同学校",
                "type": "connector"
              },
              {
                "start": 40,
                "end": 52,
                "label": "副词 closely — 紧密的联系",
                "type": "adverb"
              },
              {
                "start": 61,
                "end": 71,
                "label": "副词 regularly — 规律的联系",
                "type": "adverb"
              },
              {
                "start": 72,
                "end": 100,
                "label": "非谓语 calling...to share — 具体联系方式",
                "type": "non-finite"
              },
              {
                "start": 84,
                "end": 105,
                "label": "具象动作 share latest news + laugh together",
                "type": "concrete-imagery"
              }
            ]
          },
          "b": {
            "text": "To this day, we remain as close as ever, chatting every evening about everything from school life to our wildest dreams, which keeps our friendship fresh and strong.",
            "highlights": [
              {
                "start": 0,
                "end": 10,
                "label": "To this day 时间短语 — 持续至今",
                "type": "connector"
              },
              {
                "start": 20,
                "end": 37,
                "label": "as close as ever 比较级 — 不变的亲密",
                "type": "connector"
              },
              {
                "start": 38,
                "end": 55,
                "label": "非谓语 chatting... — 日常互动方式",
                "type": "non-finite"
              },
              {
                "start": 56,
                "end": 96,
                "label": "具象范围 from school life to wildest dreams — 无话不谈",
                "type": "concrete-imagery"
              },
              {
                "start": 97,
                "end": 120,
                "label": "非限定定语从句 , which keeps... — 效果总结",
                "type": "non-restrictive"
              }
            ]
          }
        }
      },
      {
        "id": 9,
        "role": "展望/心愿",
        "chainType": "time-layer",
        "tip": "表达对未来友谊的期盼，用 I hope / I believe / I look forward to，加具体、不泛泛的内容。",
        "vocab": [
          "I hope, I believe, I look forward to",
          "forever, throughout our lives, for years to come",
          "grow together, face challenges, share dreams"
        ],
        "patterns": [
          "I hope that ___ and I will continue to ___ and face whatever challenges life brings together.",
          "I believe our friendship will only grow stronger as we ___, because it is built on ___."
        ],
        "grammar": "I hope + 宾语从句；as 时间/原因从句",
        "discovery": {
          "a": {
            "text": "I sincerely hope that we will continue supporting each other through every stage of life and bravely face whatever challenges the future may bring together.",
            "highlights": [
              {
                "start": 0,
                "end": 5,
                "label": "I sincerely hope that 宾语从句 — 真诚期望",
                "type": "object-clause"
              },
              {
                "start": 2,
                "end": 11,
                "label": "副词 sincerely — 真诚地",
                "type": "adverb"
              },
              {
                "start": 26,
                "end": 55,
                "label": "非谓语 supporting... — 持续的相互支持",
                "type": "non-finite"
              },
              {
                "start": 64,
                "end": 88,
                "label": "副词 bravely + face — 勇敢面对",
                "type": "adverb"
              },
              {
                "start": 89,
                "end": 105,
                "label": "together 结尾 — 强调共同",
                "type": "concrete-feeling"
              }
            ]
          },
          "b": {
            "text": "I firmly believe that our friendship, which has already survived distance and time, will only grow deeper as we journey through life, sharing both our triumphs and our struggles.",
            "highlights": [
              {
                "start": 0,
                "end": 14,
                "label": "I firmly believe that 宾语从句 — 坚定信念",
                "type": "object-clause"
              },
              {
                "start": 2,
                "end": 8,
                "label": "副词 firmly — 坚定地",
                "type": "adverb"
              },
              {
                "start": 15,
                "end": 40,
                "label": "具象动词 survived distance and time — 经受考验",
                "type": "concrete-imagery"
              },
              {
                "start": 41,
                "end": 80,
                "label": "非限定定语从句 , which has... — 补充友谊的韧性",
                "type": "non-restrictive"
              },
              {
                "start": 81,
                "end": 105,
                "label": "非谓语 sharing... — 共享人生的两个方面",
                "type": "non-finite"
              }
            ]
          }
        }
      },
      {
        "id": 10,
        "role": "结论点题",
        "chainType": "time-layer",
        "tip": "有力收尾，换词呼应开头，可用排比或升华句，让读者记住你对友谊的独特理解。",
        "vocab": [
          "In a word, To sum up, Without doubt",
          "the most precious, a true blessing, a rare gift",
          "make life richer, more colourful, more meaningful"
        ],
        "patterns": [
          "In a word, ___ is not just my best friend — she/he is ___ that makes my life ___.",
          "Without doubt, having a friend like ___ is one of the greatest gifts life has given me."
        ],
        "grammar": "not just...but 升华；one of the greatest 最高级",
        "discovery": {
          "a": {
            "text": "In a word, Li Hua is not simply my best friend — he is the brother life generously gave me, someone who has made my world richer and far more meaningful.",
            "highlights": [
              {
                "start": 0,
                "end": 9,
                "label": "In a word 总结信号",
                "type": "connector"
              },
              {
                "start": 17,
                "end": 28,
                "label": "副词 simply — 不仅仅是",
                "type": "adverb"
              },
              {
                "start": 29,
                "end": 64,
                "label": "比喻 the brother life gave me — 升华为兄弟",
                "type": "concrete-feeling"
              },
              {
                "start": 49,
                "end": 59,
                "label": "副词 generously — 慷慨的赋予",
                "type": "adverb"
              },
              {
                "start": 74,
                "end": 97,
                "label": "比较级 richer + far more meaningful — 变化总结",
                "type": "change-verb"
              }
            ]
          },
          "b": {
            "text": "Without doubt, having a friend like Li Hua — someone who laughs with you in joy and stands beside you in darkness — is the most precious gift that life has ever offered me.",
            "highlights": [
              {
                "start": 0,
                "end": 12,
                "label": "Without doubt 强调 — 毫无疑问",
                "type": "connector"
              },
              {
                "start": 42,
                "end": 66,
                "label": "具象对比 laughs in joy + stands in darkness — 喜乐与黑暗",
                "type": "concrete-imagery"
              },
              {
                "start": 58,
                "end": 66,
                "label": "比喻 darkness — 困难时期",
                "type": "concrete-feeling"
              },
              {
                "start": 88,
                "end": 98,
                "label": "最高级 the most precious gift — 最珍贵的礼物",
                "type": "concrete-feeling"
              },
              {
                "start": 99,
                "end": 120,
                "label": "that 定语从句 + 现在完成时 — 人生最好的给予",
                "type": "connector"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "id": 3,
    "year": "2024仿写",
    "title": "A School Activity I Enjoyed",
    "emoji": "🎪",
    "theme": "描述一次印象深刻的校园活动",
    "color": "#fff7ed",
    "accent": "#c2410c",
    "light": "#fed7aa",
    "opening": "School life is filled with wonderful activities.",
    "sentences": [
      {
        "id": 2,
        "role": "点题引出",
        "chainType": "argument",
        "tip": "点明活动名称、时间、地点，用定语从句让句子信息丰富。避免只说'We had an activity'——要具体。",
        "vocab": [
          "sports day, science fair, art show, talent show",
          "last term, one spring morning, recently",
          "held, organised, took place, was hosted"
        ],
        "patterns": [
          "One activity that impressed me most was the ___ held last ___ at our school.",
          "Last ___, our school organised a ___ that turned out to be truly ___."
        ],
        "grammar": "that 定语从句；过去时引入事件",
        "discovery": {
          "a": {
            "text": "One activity that deeply impressed me was the school talent show, carefully organised by our student council last spring.",
            "highlights": [
              {
                "start": 0,
                "end": 17,
                "label": "One activity that... 定语从句 + 主题引入",
                "type": "connector"
              },
              {
                "start": 12,
                "end": 17,
                "label": "副词 deeply — 深刻印象",
                "type": "adverb"
              },
              {
                "start": 40,
                "end": 60,
                "label": "具体名称 school talent show — 明确活动",
                "type": "specific-detail"
              },
              {
                "start": 61,
                "end": 90,
                "label": "副词 carefully + 非谓语 organised by — 精心组织",
                "type": "non-finite"
              },
              {
                "start": 68,
                "end": 90,
                "label": "具体组织者 student council + 时间 last spring",
                "type": "specific-detail"
              }
            ]
          },
          "b": {
            "text": "Last spring, our school organised a talent show that turned out to be one of the most exciting and memorable events, which brought together students from every grade.",
            "highlights": [
              {
                "start": 0,
                "end": 30,
                "label": "具体时间 Last spring + 活动名称 talent show",
                "type": "specific-detail"
              },
              {
                "start": 31,
                "end": 64,
                "label": "that 定语从句 — 补充活动的意外精彩",
                "type": "connector"
              },
              {
                "start": 49,
                "end": 77,
                "label": "最高级 most exciting + memorable — 双重评价",
                "type": "concrete-feeling"
              },
              {
                "start": 78,
                "end": 105,
                "label": "非限定定语从句 , which brought together... — 活动的影响力",
                "type": "non-restrictive"
              },
              {
                "start": 86,
                "end": 105,
                "label": "具象范围 from every grade — 全校参与",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 3,
        "role": "活动背景/准备",
        "chainType": "causality",
        "tip": "描写活动前的期待与准备，用过去完成时或过去进行时体现时间层次。",
        "vocab": [
          "prepare, rehearse, practise, look forward to",
          "spend...doing, work hard on, get ready for",
          "excited, nervous, eager, full of anticipation"
        ],
        "patterns": [
          "We had been looking forward to it for weeks, spending every spare moment ___.",
          "Before the big day, our class had ___, which made us feel both nervous and ___."
        ],
        "grammar": "过去完成时 which 结果从句；spend time doing",
        "discovery": {
          "a": {
            "text": "We had eagerly looked forward to this event for weeks, spending nearly every lunch break practising our performance together in the empty music room.",
            "highlights": [
              {
                "start": 8,
                "end": 15,
                "label": "副词 eagerly — 迫切的期待",
                "type": "adverb"
              },
              {
                "start": 16,
                "end": 29,
                "label": "过去完成时 had looked forward — 持续的期待",
                "type": "connector"
              },
              {
                "start": 48,
                "end": 85,
                "label": "非谓语 spending...practising... — 投入准备",
                "type": "non-finite"
              },
              {
                "start": 54,
                "end": 70,
                "label": "具体时间 nearly every lunch break — 用掉的时间",
                "type": "specific-detail"
              },
              {
                "start": 85,
                "end": 105,
                "label": "具体地点 empty music room — 真实场景",
                "type": "specific-detail"
              }
            ]
          },
          "b": {
            "text": "Before the big day arrived, our entire class had thrown ourselves into weeks of intense preparation, which filled the rehearsal room with nervous laughter, forgotten lines, and growing excitement.",
            "highlights": [
              {
                "start": 0,
                "end": 14,
                "label": "Before 时间从句 — 建立时间层次",
                "type": "connector"
              },
              {
                "start": 28,
                "end": 40,
                "label": "具象动词 thrown ourselves into — 全身心投入",
                "type": "concrete-imagery"
              },
              {
                "start": 71,
                "end": 100,
                "label": "非限定定语从句 , which filled... — 准备过程的效果",
                "type": "non-restrictive"
              },
              {
                "start": 85,
                "end": 120,
                "label": "具象名词三连排 nervous laughter, forgotten lines, growing excitement",
                "type": "concrete-imagery"
              },
              {
                "start": 112,
                "end": 120,
                "label": "形容词 growing — 逐渐增长的兴奋",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 4,
        "role": "活动过程①",
        "chainType": "causality",
        "tip": "按时间顺序描写活动第一阶段，First / To begin with 衔接，加一个具体的感官描写细节。",
        "vocab": [
          "first, to begin with, at the start",
          "the crowd, the atmosphere, the stage, the arena",
          "filled with, echoed with, burst into"
        ],
        "patterns": [
          "To begin with, ___, and the whole ___ was filled with ___ and excitement.",
          "First, we ___, and I could feel the energy in the air as everyone ___."
        ],
        "grammar": "the whole 强调；as 时间从句描述同步动作",
        "discovery": {
          "a": {
            "text": "To begin with, the school hall was completely filled with excited students and teachers, and the air buzzed warmly with anticipation and cheerful chatter.",
            "highlights": [
              {
                "start": 0,
                "end": 12,
                "label": "To begin with 时间衔接 — 顺序展开",
                "type": "connector"
              },
              {
                "start": 27,
                "end": 37,
                "label": "副词 completely — 完全填满",
                "type": "adverb"
              },
              {
                "start": 46,
                "end": 70,
                "label": "具象画面 excited students + teachers — 人群描写",
                "type": "concrete-imagery"
              },
              {
                "start": 76,
                "end": 101,
                "label": "副词 warmly + 具象名词 anticipation + chatter — 氛围感",
                "type": "adverb"
              },
              {
                "start": 86,
                "end": 101,
                "label": "具象听觉 cheerful chatter — 声音细节",
                "type": "concrete-imagery"
              }
            ]
          },
          "b": {
            "text": "First, the lights dimmed slowly and a hush fell over the packed hall — a magical silence, which was soon broken by the opening notes of music that sent a shiver of excitement through the crowd.",
            "highlights": [
              {
                "start": 0,
                "end": 5,
                "label": "First 时间顺序",
                "type": "connector"
              },
              {
                "start": 12,
                "end": 31,
                "label": "副词 slowly + 具象动词 dimmed — 渐暗的画面",
                "type": "adverb"
              },
              {
                "start": 32,
                "end": 51,
                "label": "具象名词 packed hall — 充满的大厅",
                "type": "concrete-imagery"
              },
              {
                "start": 52,
                "end": 83,
                "label": "非限定定语从句 , which was soon broken... — 转折时刻",
                "type": "non-restrictive"
              },
              {
                "start": 84,
                "end": 105,
                "label": "具象表达 shiver of excitement — 兴奋的颤抖",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 5,
        "role": "活动过程②/高潮",
        "chainType": "causality",
        "tip": "写最精彩的高潮时刻，用 Suddenly / At that moment / To everyone's surprise 制造转折感和惊喜。",
        "vocab": [
          "suddenly, at that moment, to our surprise, unexpectedly",
          "cheered, applauded, burst into laughter, gasped",
          "the highlight, the turning point, the most thrilling moment"
        ],
        "patterns": [
          "Suddenly, ___, and the whole crowd ___ with excitement.",
          "To everyone's surprise, ___, which turned out to be the highlight of the entire event."
        ],
        "grammar": "To everyone's surprise 插入语；which 引出结果",
        "discovery": {
          "a": {
            "text": "Suddenly, a shy boy from our class stepped confidently onto the stage and sang so beautifully that the entire audience fell completely silent before bursting into wild applause.",
            "highlights": [
              {
                "start": 0,
                "end": 8,
                "label": "Suddenly 转折信号 — 制造惊喜",
                "type": "connector"
              },
              {
                "start": 20,
                "end": 38,
                "label": "副词 confidently — 自信地登场",
                "type": "adverb"
              },
              {
                "start": 51,
                "end": 65,
                "label": "副词 beautifully — 优美地唱",
                "type": "adverb"
              },
              {
                "start": 76,
                "end": 95,
                "label": "副词 completely + silent — 全场寂静",
                "type": "adverb"
              },
              {
                "start": 96,
                "end": 125,
                "label": "具象对比 wild applause — 从寂静到狂热的转折",
                "type": "concrete-imagery"
              }
            ]
          },
          "b": {
            "text": "To everyone's complete surprise, the quietest student in our grade delivered a breathtaking piano performance, which turned the ordinary afternoon into an unforgettable moment that moved many to tears.",
            "highlights": [
              {
                "start": 0,
                "end": 22,
                "label": "To everyone's...surprise 插入语 + 副词 complete",
                "type": "connector"
              },
              {
                "start": 44,
                "end": 76,
                "label": "具象形容词 breathtaking + 具体 performance — 惊人表演",
                "type": "concrete-imagery"
              },
              {
                "start": 77,
                "end": 110,
                "label": "非限定定语从句 , which turned... — 改变了整个下午",
                "type": "non-restrictive"
              },
              {
                "start": 85,
                "end": 110,
                "label": "Change核 turned + into — 平凡变非凡",
                "type": "change-verb"
              },
              {
                "start": 111,
                "end": 125,
                "label": "具象表达 moved many to tears — 感动到流泪",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 6,
        "role": "个人参与",
        "chainType": "causality",
        "tip": "写你自己在活动中的具体角色或表现，第一人称细节使叙述有代入感，加情感动词。",
        "vocab": [
          "I was responsible for, I took part in, I volunteered",
          "performed, presented, competed, demonstrated",
          "proudly, nervously, confidently, wholeheartedly"
        ],
        "patterns": [
          "I was responsible for ___, and when the moment came, I ___ with all my heart.",
          "When it was my turn to ___, I felt ___, but I took a deep breath and ___."
        ],
        "grammar": "when 时间从句；with all my heart 方式短语",
        "discovery": {
          "a": {
            "text": "I was responsible for introducing each act, and although my hands were shaking slightly, I spoke clearly and managed to keep the audience engaged throughout the show.",
            "highlights": [
              {
                "start": 0,
                "end": 26,
                "label": "具体角色 was responsible for introducing — 明确责任",
                "type": "specific-detail"
              },
              {
                "start": 62,
                "end": 78,
                "label": "副词 slightly + clearly — 轻微的紧张 + 清晰的表达",
                "type": "adverb"
              },
              {
                "start": 50,
                "end": 62,
                "label": "具象描写 hands shaking — 真实的身体反应",
                "type": "concrete-imagery"
              },
              {
                "start": 79,
                "end": 99,
                "label": "非谓语 to keep...engaged — 维持观众注意",
                "type": "non-finite"
              },
              {
                "start": 116,
                "end": 125,
                "label": "throughout the show — 全程",
                "type": "specific-detail"
              }
            ]
          },
          "b": {
            "text": "When it was finally my turn to present our class project, I walked onto the brightly lit stage with a pounding heart, but the warm smiles and encouraging nods from my classmates, which I spotted in the front row, gave me instant courage.",
            "highlights": [
              {
                "start": 0,
                "end": 17,
                "label": "When 时间从句 + 副词 finally — 轮到我了",
                "type": "connector"
              },
              {
                "start": 36,
                "end": 55,
                "label": "具象画面 brightly lit stage + pounding heart — 感官对比",
                "type": "concrete-imagery"
              },
              {
                "start": 69,
                "end": 100,
                "label": "具象名词 warm smiles + encouraging nods — 鼓励的细节",
                "type": "concrete-imagery"
              },
              {
                "start": 101,
                "end": 125,
                "label": "非限定定语从句 , which I spotted... — 捕捉到鼓励",
                "type": "non-restrictive"
              },
              {
                "start": 118,
                "end": 125,
                "label": "具象表达 instant courage — 瞬间的勇气",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 7,
        "role": "同伴反应/合作",
        "chainType": "causality",
        "tip": "写同学或老师的反应，体现集体意义，间接引语或描写性句子增加真实感和温度。",
        "vocab": [
          "my classmates, our teacher, the audience, the judges",
          "encouraged, praised, cheered for, supported",
          "together, as a team, side by side, united"
        ],
        "patterns": [
          "My classmates ___, which encouraged me greatly and made me feel we were truly a team.",
          "Our teacher told us that ___, and those words gave us the strength to ___."
        ],
        "grammar": "间接引语 told us that；which 表结果",
        "discovery": {
          "a": {
            "text": "My classmates cheered loudly from the front row, waving their hands excitedly, and our teacher nodded approvingly with tears of pride in her eyes.",
            "highlights": [
              {
                "start": 15,
                "end": 21,
                "label": "副词 loudly — 大声欢呼",
                "type": "adverb"
              },
              {
                "start": 33,
                "end": 56,
                "label": "非谓语 waving... — 挥手的伴随动作",
                "type": "non-finite"
              },
              {
                "start": 44,
                "end": 56,
                "label": "副词 excitedly — 兴奋地",
                "type": "adverb"
              },
              {
                "start": 72,
                "end": 85,
                "label": "副词 approvingly — 赞许地点头",
                "type": "adverb"
              },
              {
                "start": 86,
                "end": 115,
                "label": "具象画面 tears of pride — 骄傲的泪水",
                "type": "concrete-imagery"
              }
            ]
          },
          "b": {
            "text": "Our teacher later told us with a trembling voice that she had never felt prouder, and her heartfelt words, which echoed in the quiet hall, gave every one of us the strength to believe in ourselves more deeply.",
            "highlights": [
              {
                "start": 12,
                "end": 25,
                "label": "具象描写 trembling voice — 颤抖的声音",
                "type": "concrete-imagery"
              },
              {
                "start": 35,
                "end": 55,
                "label": "间接引语 told us that... — 老师的话",
                "type": "connector"
              },
              {
                "start": 57,
                "end": 72,
                "label": "形容词 heartfelt — 发自内心的",
                "type": "concrete-feeling"
              },
              {
                "start": 73,
                "end": 105,
                "label": "非限定定语从句 , which echoed... — 话语回荡",
                "type": "non-restrictive"
              },
              {
                "start": 110,
                "end": 125,
                "label": "Mind核 believe + 副词 deeply — 更深的相信",
                "type": "mind-verb"
              }
            ]
          }
        }
      },
      {
        "id": 8,
        "role": "情感收获",
        "chainType": "imagery",
        "tip": "写活动后你的精神和情感收获，用 I realised / I discovered / not only...but also 体现成长。",
        "vocab": [
          "I realised, I discovered, I came to understand",
          "confidence, courage, teamwork, perseverance",
          "not only...but also, grow, change, transform"
        ],
        "patterns": [
          "After ___, I realised that ___ was far more important than I had ever imagined.",
          "I gained not only ___ but also a deeper understanding of what it means to ___."
        ],
        "grammar": "not only...but also 并列；what it means to do 名词从句",
        "discovery": {
          "a": {
            "text": "After the show, I suddenly realised that courage is not about being fearless, but about stepping forward bravely even when your heart is racing with fear.",
            "highlights": [
              {
                "start": 12,
                "end": 36,
                "label": "副词 suddenly + Mind核 realised — 突然领悟",
                "type": "mind-verb"
              },
              {
                "start": 37,
                "end": 72,
                "label": "not about...but about... 对比结构 — 深刻见解",
                "type": "connector"
              },
              {
                "start": 52,
                "end": 60,
                "label": "具象名词 fearless — 无畏",
                "type": "concrete-feeling"
              },
              {
                "start": 72,
                "end": 94,
                "label": "非谓语 stepping forward — 向前迈步",
                "type": "non-finite"
              },
              {
                "start": 84,
                "end": 94,
                "label": "副词 bravely + 具象描写 heart racing — 勇敢面对恐惧",
                "type": "adverb"
              }
            ]
          },
          "b": {
            "text": "I gained not only a surge of confidence but also a deep understanding of what it truly means to work as one team — a lesson that has stayed with me long after the applause faded.",
            "highlights": [
              {
                "start": 0,
                "end": 7,
                "label": "not only...but also — 双重收获",
                "type": "connector"
              },
              {
                "start": 11,
                "end": 24,
                "label": "具象名词 surge of confidence — 信心的涌起",
                "type": "concrete-feeling"
              },
              {
                "start": 45,
                "end": 68,
                "label": "what it means to... 名词从句 — 深层理解",
                "type": "object-clause"
              },
              {
                "start": 71,
                "end": 82,
                "label": "副词 truly + 具象 work as one team",
                "type": "adverb"
              },
              {
                "start": 83,
                "end": 110,
                "label": "that 定语从句 + 具象画面 applause faded — 持续的影响",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 9,
        "role": "活动的意义",
        "chainType": "time-layer",
        "tip": "将个人经历升华为对校园活动普遍价值的思考，Such activities... 引出，体现大局观。",
        "vocab": [
          "such activities, events like this, experiences like these",
          "broaden horizons, build character, develop skills",
          "beyond textbooks, in real life, cannot be learned from books"
        ],
        "patterns": [
          "Such activities allow us to ___ and discover sides of ourselves that ___.",
          "Events like this teach us lessons that no textbook can ever fully ___."
        ],
        "grammar": "allow sb. to do；that 定语从句；比较含义的表达",
        "discovery": {
          "a": {
            "text": "Such activities genuinely allow us to discover hidden talents and gradually build confidence that cannot be learned from textbooks or exams alone.",
            "highlights": [
              {
                "start": 0,
                "end": 13,
                "label": "Such activities 总结类名词 — 引出普遍价值",
                "type": "connector"
              },
              {
                "start": 14,
                "end": 23,
                "label": "副词 genuinely — 真正地",
                "type": "adverb"
              },
              {
                "start": 37,
                "end": 54,
                "label": "非谓语 to discover... — 发现隐藏才能",
                "type": "non-finite"
              },
              {
                "start": 44,
                "end": 54,
                "label": "形容词 hidden — 隐藏的",
                "type": "concrete-feeling"
              },
              {
                "start": 58,
                "end": 74,
                "label": "副词 gradually + Change核 build — 逐渐建立",
                "type": "change-verb"
              }
            ]
          },
          "b": {
            "text": "Events like this talent show, which pull us out of our daily routine and push us into the spotlight, teach us invaluable lessons about courage and self-belief that no classroom alone can offer.",
            "highlights": [
              {
                "start": 0,
                "end": 21,
                "label": "Events like this 一般化 + 具体名称 talent show",
                "type": "connector"
              },
              {
                "start": 22,
                "end": 60,
                "label": "非限定定语从句 , which pull...push... 双动作对照",
                "type": "non-restrictive"
              },
              {
                "start": 39,
                "end": 60,
                "label": "具象对比 out of routine → into spotlight",
                "type": "concrete-imagery"
              },
              {
                "start": 61,
                "end": 77,
                "label": "形容词 invaluable + 名词 lessons",
                "type": "concrete-feeling"
              },
              {
                "start": 78,
                "end": 100,
                "label": "that 定语从句 + 否定 no classroom alone — 课堂无法替代",
                "type": "connector"
              }
            ]
          }
        }
      },
      {
        "id": 10,
        "role": "结论/期盼",
        "chainType": "argument",
        "tip": "以积极向上的语气结尾，期望更多类似活动，首尾呼应，可用 make + 宾 + 形容词收束。",
        "vocab": [
          "I hope, I look forward to, I believe",
          "more activities like this, similar opportunities",
          "make school life richer, more colourful, truly unforgettable"
        ],
        "patterns": [
          "I sincerely hope we can have more activities like this, for they make school life truly ___.",
          "Wonderful activities like this remind me that school is not just about ___ — it is also about ___."
        ],
        "grammar": "for 引出原因；remind sb. that 宾语从句",
        "discovery": {
          "a": {
            "text": "I sincerely hope our school will continue organising more events like this, for they genuinely make our school life richer, more colourful, and truly unforgettable.",
            "highlights": [
              {
                "start": 0,
                "end": 5,
                "label": "I sincerely hope — 真诚期盼",
                "type": "object-clause"
              },
              {
                "start": 2,
                "end": 11,
                "label": "副词 sincerely — 真诚地",
                "type": "adverb"
              },
              {
                "start": 58,
                "end": 70,
                "label": "副词 genuinely — 真正地",
                "type": "adverb"
              },
              {
                "start": 71,
                "end": 97,
                "label": "形容词三连排 richer, more colourful, truly unforgettable — 递进",
                "type": "concrete-feeling"
              },
              {
                "start": 93,
                "end": 97,
                "label": "副词 truly — 真正地",
                "type": "adverb"
              }
            ]
          },
          "b": {
            "text": "Wonderful activities like this constantly remind me that school is not just a place for grades and exams — it is also where we discover who we really are, surrounded by people who believe in us.",
            "highlights": [
              {
                "start": 0,
                "end": 23,
                "label": "Wonderful activities... 主题呼应 + 副词 constantly",
                "type": "connector"
              },
              {
                "start": 24,
                "end": 48,
                "label": "remind me that 宾语从句 — 引出感悟",
                "type": "object-clause"
              },
              {
                "start": 49,
                "end": 82,
                "label": "not just...it is also... 对比升华",
                "type": "connector"
              },
              {
                "start": 62,
                "end": 86,
                "label": "具象对比 grades + exams vs discover who we are",
                "type": "concrete-feeling"
              },
              {
                "start": 87,
                "end": 108,
                "label": "非谓语 surrounded by... + who 定语从句 — 被信任的人包围",
                "type": "non-finite"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "id": 4,
    "year": "2021仿写",
    "title": "My Hometown",
    "emoji": "🏙️",
    "theme": "介绍家乡的特色与变化",
    "color": "#fdf4ff",
    "accent": "#7e22ce",
    "light": "#f3e8ff",
    "opening": "I come from a city called Wuhan, which is known as 'the city of rivers'.",
    "sentences": [
      {
        "id": 2,
        "role": "地理位置",
        "chainType": "imagery",
        "tip": "介绍家乡的地理位置或自然环境，用 located / situated / which 引出，简洁而信息丰富。",
        "vocab": [
          "located in, situated in, nestled along",
          "central, southern, northern, eastern",
          "well-known for, famous for, recognised as"
        ],
        "patterns": [
          "Located in ___ China, my hometown is ___ and ___.",
          "My hometown is situated along ___, making it one of the most ___ cities in the region."
        ],
        "grammar": "过去分词短语作状语；making 现在分词表结果",
        "discovery": {
          "a": {
            "text": "Located right in the heart of central China, my hometown is a vibrant city where the mighty Yangtze River flows gracefully through its very centre.",
            "highlights": [
              {
                "start": 0,
                "end": 7,
                "label": "非谓语 Located... — 过去分词作状语",
                "type": "non-finite"
              },
              {
                "start": 8,
                "end": 14,
                "label": "副词 right — 精确位置",
                "type": "adverb"
              },
              {
                "start": 42,
                "end": 59,
                "label": "形容词 vibrant + where 定语从句 — 活力城市",
                "type": "concrete-imagery"
              },
              {
                "start": 68,
                "end": 87,
                "label": "副词 gracefully — 优雅地流淌",
                "type": "adverb"
              },
              {
                "start": 47,
                "end": 65,
                "label": "具象描写 mighty Yangtze River",
                "type": "specific-detail"
              }
            ]
          },
          "b": {
            "text": "My hometown Wuhan, which is often called the city of rivers, sits proudly at the meeting point of the Yangtze and Han rivers, creating a landscape of shimmering water and endless bridges.",
            "highlights": [
              {
                "start": 13,
                "end": 34,
                "label": "地名 Wuhan + 非限定定语从句 , which is often called...",
                "type": "non-restrictive"
              },
              {
                "start": 47,
                "end": 60,
                "label": "副词 proudly + 具象 sits at the meeting point",
                "type": "adverb"
              },
              {
                "start": 61,
                "end": 79,
                "label": "具象地理 meeting point of two rivers — 两江交汇",
                "type": "specific-detail"
              },
              {
                "start": 80,
                "end": 110,
                "label": "非谓语 creating... — 现在分词表结果",
                "type": "non-finite"
              },
              {
                "start": 90,
                "end": 110,
                "label": "具象画面 shimmering water + endless bridges",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 3,
        "role": "著名景点",
        "chainType": "imagery",
        "tip": "介绍一个最具代表性的景点，用 where / which 定语从句补充信息，避免只列名称不描述。",
        "vocab": [
          "the Yellow Crane Tower, East Lake, Wuhan University",
          "where tourists, which attracts, famous for",
          "historic, breathtaking, magnificent, iconic"
        ],
        "patterns": [
          "One of the most famous attractions is ___, where ___ and ___.",
          "The ___ is a place which attracts millions of visitors each year because ___."
        ],
        "grammar": "where 引导定语从句；which attracts 非限制性定语从句",
        "discovery": {
          "a": {
            "text": "One of its most famous attractions is the Yellow Crane Tower, standing majestically on a hilltop where visitors can look out over the entire city and the flowing river below.",
            "highlights": [
              {
                "start": 0,
                "end": 35,
                "label": "具体名称 Yellow Crane Tower — 黄鹤楼",
                "type": "specific-detail"
              },
              {
                "start": 35,
                "end": 64,
                "label": "非谓语 standing... — 伫立山巅",
                "type": "non-finite"
              },
              {
                "start": 46,
                "end": 57,
                "label": "副词 majestically — 雄伟地",
                "type": "adverb"
              },
              {
                "start": 58,
                "end": 85,
                "label": "where 定语从句 — 俯瞰全城",
                "type": "connector"
              },
              {
                "start": 86,
                "end": 105,
                "label": "具象画面 entire city + flowing river — 宏大视野",
                "type": "concrete-imagery"
              }
            ]
          },
          "b": {
            "text": "The most iconic landmark is the Yellow Crane Tower, a magnificent ancient pagoda whose golden roof catches the morning sun, which attracts millions of visitors who come to admire its timeless beauty.",
            "highlights": [
              {
                "start": 0,
                "end": 40,
                "label": "最高级 most iconic + 同位语 magnificent ancient pagoda",
                "type": "concrete-imagery"
              },
              {
                "start": 41,
                "end": 75,
                "label": "whose 定语从句 + 具象 golden roof + morning sun",
                "type": "connector"
              },
              {
                "start": 56,
                "end": 70,
                "label": "具象动词 catches the morning sun — 捕捉晨光",
                "type": "concrete-imagery"
              },
              {
                "start": 76,
                "end": 102,
                "label": "非限定定语从句 , which attracts... — 吸引游客",
                "type": "non-restrictive"
              },
              {
                "start": 102,
                "end": 120,
                "label": "具象表达 timeless beauty — 永恒之美",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 4,
        "role": "美食文化",
        "chainType": "imagery",
        "tip": "写家乡特色美食，用具体名称和口感描写，让读者'尝'到家乡味道，体现文化自信。",
        "vocab": [
          "hot dry noodles, duck neck, steamed buns",
          "spicy, savoury, fragrant, crispy, flavourful",
          "I can never resist / it is hard to forget / nothing compares to"
        ],
        "patterns": [
          "When it comes to food, nothing can compare to ___, which is ___ and simply ___.",
          "I can never resist ___, a traditional dish that ___ and has been loved by locals for centuries."
        ],
        "grammar": "When it comes to 固定表达；which 描述特征",
        "discovery": {
          "a": {
            "text": "When it comes to food, I can never resist the famous hot dry noodles, generously mixed with sesame paste and spices, filling the morning air with their rich, inviting smell.",
            "highlights": [
              {
                "start": 0,
                "end": 16,
                "label": "When it comes to 话题转换 — 自然引入食物",
                "type": "connector"
              },
              {
                "start": 24,
                "end": 32,
                "label": "具象名称 hot dry noodles — 热干面",
                "type": "specific-detail"
              },
              {
                "start": 42,
                "end": 52,
                "label": "副词 generously — 大方地混合",
                "type": "adverb"
              },
              {
                "start": 53,
                "end": 88,
                "label": "非谓语 mixed with... + filling... — 双分词描写",
                "type": "non-finite"
              },
              {
                "start": 89,
                "end": 105,
                "label": "具象感官 rich, inviting smell — 诱人香味",
                "type": "concrete-imagery"
              }
            ]
          },
          "b": {
            "text": "Nothing can compare to Wuhan's hot dry noodles, a simple yet unforgettable dish whose chewy texture and nutty sesame aroma, which hits you the moment you walk into any street stall, make it the soul of our city's breakfast culture.",
            "highlights": [
              {
                "start": 0,
                "end": 16,
                "label": "Nothing can compare to 最高级强调",
                "type": "connector"
              },
              {
                "start": 28,
                "end": 45,
                "label": "同位语 + 形容词 simple yet unforgettable",
                "type": "concrete-feeling"
              },
              {
                "start": 46,
                "end": 85,
                "label": "whose 定语从句 + 具象 chewy texture + nutty aroma",
                "type": "concrete-imagery"
              },
              {
                "start": 86,
                "end": 105,
                "label": "非限定定语从句 , which hits you... — 扑面而来",
                "type": "non-restrictive"
              },
              {
                "start": 102,
                "end": 120,
                "label": "具象比喻 soul of breakfast culture",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 5,
        "role": "历史文化",
        "chainType": "argument",
        "tip": "谈家乡的历史或文化底蕴，用 has a history of / dates back to / is deeply rooted in，展示深度。",
        "vocab": [
          "has a history of, dates back to, is home to",
          "culture, tradition, heritage, pride",
          "deeply rooted in, passed down through generations"
        ],
        "patterns": [
          "My hometown has a history of over ___ years and is home to ___.",
          "The culture here is deeply rooted in ___, with traditions that have been passed down for generations."
        ],
        "grammar": "has a history of + 时间；过去分词短语 passed down",
        "discovery": {
          "a": {
            "text": "My hometown has a history of over 3,500 years and is proudly home to the ancient Chu culture, whose art and poetry have deeply influenced Chinese civilisation.",
            "highlights": [
              {
                "start": 0,
                "end": 20,
                "label": "具体时间 has a history of 3,500 years — 历史厚重",
                "type": "specific-detail"
              },
              {
                "start": 32,
                "end": 40,
                "label": "副词 proudly — 自豪地",
                "type": "adverb"
              },
              {
                "start": 41,
                "end": 65,
                "label": "具体文化名称 ancient Chu culture — 楚文化",
                "type": "specific-detail"
              },
              {
                "start": 66,
                "end": 95,
                "label": "whose 定语从句 — 文化的影响",
                "type": "connector"
              },
              {
                "start": 84,
                "end": 105,
                "label": "副词 deeply + Change核 influenced",
                "type": "change-verb"
              }
            ]
          },
          "b": {
            "text": "Wuhan's culture is deeply rooted in centuries of river trade and poetry, with countless traditions and legends, which have been lovingly preserved and passed down through countless generations of proud Wuhan people.",
            "highlights": [
              {
                "start": 18,
                "end": 33,
                "label": "副词 deeply + 短语 rooted in — 深入扎根",
                "type": "adverb"
              },
              {
                "start": 34,
                "end": 68,
                "label": "具象名词 river trade + poetry — 商贸与诗歌",
                "type": "concrete-imagery"
              },
              {
                "start": 73,
                "end": 87,
                "label": "形容词 countless + lovingly — 数量与情感",
                "type": "adverb"
              },
              {
                "start": 87,
                "end": 110,
                "label": "非限定定语从句 , which have been preserved... — 传承",
                "type": "non-restrictive"
              },
              {
                "start": 96,
                "end": 110,
                "label": "具象 passed down through generations — 代代相传",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 6,
        "role": "近年变化",
        "chainType": "causality",
        "tip": "写家乡近年来的发展变化，用现在完成时（have/has + 过去分词）体现持续变化。",
        "vocab": [
          "in recent years, over the past decade, nowadays",
          "has developed, has improved, has become",
          "modern, advanced, convenient, prosperous, vibrant"
        ],
        "patterns": [
          "In recent years, my hometown has changed greatly, with ___ and ___ everywhere.",
          "Over the past decade, ___ has developed rapidly, becoming one of the most ___ cities in China."
        ],
        "grammar": "现在完成时表变化；with + 名词短语作伴随状语",
        "discovery": {
          "a": {
            "text": "In recent years, Wuhan has rapidly transformed into a modern metropolis, with gleaming skyscrapers rising everywhere and efficient metro lines connecting every corner of the city.",
            "highlights": [
              {
                "start": 0,
                "end": 14,
                "label": "In recent years + 现在完成时 — 建立时间框架",
                "type": "connector"
              },
              {
                "start": 20,
                "end": 28,
                "label": "副词 rapidly — 快速变化",
                "type": "adverb"
              },
              {
                "start": 29,
                "end": 41,
                "label": "Change核 transformed — 彻底转变",
                "type": "change-verb"
              },
              {
                "start": 56,
                "end": 79,
                "label": "非谓语 rising everywhere — 到处耸立",
                "type": "non-finite"
              },
              {
                "start": 45,
                "end": 55,
                "label": "具象形容词 gleaming skyscrapers — 闪闪发光的高楼",
                "type": "concrete-imagery"
              }
            ]
          },
          "b": {
            "text": "Over the past decade, my hometown has changed beyond recognition, becoming a stunning blend of old and new where centuries-old temples stand peacefully beside towering glass buildings, which perfectly captures Wuhan's unique spirit.",
            "highlights": [
              {
                "start": 0,
                "end": 20,
                "label": "Over the past decade + 现在完成时",
                "type": "connector"
              },
              {
                "start": 28,
                "end": 48,
                "label": "具象表达 beyond recognition — 翻天覆地",
                "type": "concrete-imagery"
              },
              {
                "start": 49,
                "end": 74,
                "label": "非谓语 becoming... — 成为...的融合",
                "type": "non-finite"
              },
              {
                "start": 58,
                "end": 74,
                "label": "具象对比 blend of old and new",
                "type": "concrete-imagery"
              },
              {
                "start": 74,
                "end": 105,
                "label": "where 定语从句 + 画面 temples beside glass buildings",
                "type": "concrete-imagery"
              },
              {
                "start": 105,
                "end": 125,
                "label": "非限定定语从句 , which perfectly captures... — 完美体现",
                "type": "non-restrictive"
              }
            ]
          }
        }
      },
      {
        "id": 7,
        "role": "个人情感",
        "chainType": "imagery",
        "tip": "抒发你对家乡的个人情感，用 whenever / no matter where 强调情感深度，避免干燥叙述。",
        "vocab": [
          "whenever I think of, no matter where I go",
          "a sense of belonging, pride, warmth, nostalgia",
          "I feel, it reminds me of, it is where I belong"
        ],
        "patterns": [
          "Whenever I think of my hometown, I feel a deep sense of ___ and ___.",
          "No matter where I go in the future, ___ will always be the place where I ___."
        ],
        "grammar": "Whenever 让步/条件；No matter where 让步从句",
        "discovery": {
          "a": {
            "text": "Whenever I think of my hometown, I instantly feel a deep and warm sense of belonging — a feeling that no other city has ever been able to give me.",
            "highlights": [
              {
                "start": 0,
                "end": 8,
                "label": "Whenever 条件/时间从句 — 每次想起",
                "type": "connector"
              },
              {
                "start": 22,
                "end": 33,
                "label": "副词 instantly — 立刻地",
                "type": "adverb"
              },
              {
                "start": 42,
                "end": 54,
                "label": "形容词 deep + warm — 深厚温暖的归属感",
                "type": "concrete-feeling"
              },
              {
                "start": 55,
                "end": 76,
                "label": "具象名词 sense of belonging — 归属感",
                "type": "concrete-feeling"
              },
              {
                "start": 77,
                "end": 100,
                "label": "that 定语从句 + 否定比较 — 无可替代",
                "type": "connector"
              }
            ]
          },
          "b": {
            "text": "No matter where life takes me in the future, Wuhan will always be the place where my fondest memories live — the familiar streets, the morning market sounds, and the river breeze that carries the scent of home.",
            "highlights": [
              {
                "start": 0,
                "end": 9,
                "label": "No matter where 让步从句 — 无论去哪",
                "type": "connector"
              },
              {
                "start": 42,
                "end": 65,
                "label": "where 定语从句 + 最高级 fondest memories",
                "type": "concrete-feeling"
              },
              {
                "start": 65,
                "end": 85,
                "label": "具象名词三连排 familiar streets, market sounds, river breeze",
                "type": "concrete-imagery"
              },
              {
                "start": 85,
                "end": 105,
                "label": "that 定语从句 + 具象 carries the scent of home",
                "type": "concrete-imagery"
              },
              {
                "start": 75,
                "end": 85,
                "label": "具象感官 morning market sounds — 声音记忆",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 8,
        "role": "与众不同之处",
        "chainType": "contrast",
        "tip": "点出家乡最独特、最难忘的一点，用 What makes...special is that 结构突出重点，提升表达档次。",
        "vocab": [
          "what makes it special, what sets it apart",
          "unique, one of a kind, unlike any other",
          "the people, the spirit, the blend of old and new"
        ],
        "patterns": [
          "What makes my hometown truly special is that ___, which you cannot find anywhere else.",
          "What sets ___ apart from other cities is its ___, a perfect blend of ___ and ___."
        ],
        "grammar": "What makes...is that 主语从句；which 非限制性定语从句",
        "discovery": {
          "a": {
            "text": "What truly makes Wuhan special is that it never stops moving forward — people here work tirelessly, dream boldly, and warmly welcome everyone who comes to this city.",
            "highlights": [
              {
                "start": 0,
                "end": 12,
                "label": "What...主语从句 + 副词 truly — 真正特别之处",
                "type": "connector"
              },
              {
                "start": 46,
                "end": 56,
                "label": "副词 tirelessly — 不知疲倦地工作",
                "type": "adverb"
              },
              {
                "start": 57,
                "end": 70,
                "label": "副词 boldly + warmly — 勇敢 + 温暖",
                "type": "adverb"
              },
              {
                "start": 71,
                "end": 85,
                "label": "具象动词 warmly welcome — 热情欢迎",
                "type": "concrete-imagery"
              },
              {
                "start": 85,
                "end": 105,
                "label": "who 定语从句 — 来到这座城市的人",
                "type": "connector"
              }
            ]
          },
          "b": {
            "text": "What sets Wuhan apart from every other city I have visited is its people's unbreakable spirit — a rare combination of toughness and warmth, which you can feel in every bowl of noodles served with a smile and every helping hand offered to a stranger.",
            "highlights": [
              {
                "start": 0,
                "end": 28,
                "label": "What sets...apart 主语从句 — 与众不同",
                "type": "connector"
              },
              {
                "start": 60,
                "end": 80,
                "label": "具象名词 unbreakable spirit + rare combination",
                "type": "concrete-feeling"
              },
              {
                "start": 81,
                "end": 105,
                "label": "非限定定语从句 , which you can feel... — 可感知的精神",
                "type": "non-restrictive"
              },
              {
                "start": 87,
                "end": 105,
                "label": "具象画面 every bowl of noodles served with a smile",
                "type": "concrete-imagery"
              },
              {
                "start": 105,
                "end": 125,
                "label": "具象对比 helping hand offered to a stranger",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 9,
        "role": "对家乡的期望",
        "chainType": "time-layer",
        "tip": "展望家乡未来，用 I hope / I believe / I am confident that 表达美好愿景，积极正向。",
        "vocab": [
          "I hope, I believe, I am confident that",
          "continue to grow, thrive, become even better",
          "a brighter future, more opportunities, greater success"
        ],
        "patterns": [
          "I believe that my hometown will continue to ___ and offer more ___ for its people.",
          "I am confident that ___ will become an even more ___ city in the years to come."
        ],
        "grammar": "I believe / I am confident + that 宾语从句",
        "discovery": {
          "a": {
            "text": "I firmly believe that Wuhan will continue growing steadily, offering more opportunities for young people and proudly remaining a city where dreams can truly take flight.",
            "highlights": [
              {
                "start": 0,
                "end": 13,
                "label": "I firmly believe that 宾语从句 — 坚定信念",
                "type": "object-clause"
              },
              {
                "start": 2,
                "end": 8,
                "label": "副词 firmly — 坚定地",
                "type": "adverb"
              },
              {
                "start": 22,
                "end": 42,
                "label": "副词 steadily + Change核 growing — 稳步成长",
                "type": "change-verb"
              },
              {
                "start": 43,
                "end": 68,
                "label": "非谓语 offering... — 提供机会",
                "type": "non-finite"
              },
              {
                "start": 85,
                "end": 100,
                "label": "具象比喻 dreams can take flight — 梦想起飞",
                "type": "concrete-feeling"
              }
            ]
          },
          "b": {
            "text": "I am deeply confident that my hometown, which has already achieved so much against all odds, will grow into an even more prosperous and inclusive city that future generations will be proud to call home.",
            "highlights": [
              {
                "start": 0,
                "end": 19,
                "label": "I am deeply confident that 宾语从句",
                "type": "object-clause"
              },
              {
                "start": 5,
                "end": 12,
                "label": "副词 deeply — 深深地",
                "type": "adverb"
              },
              {
                "start": 20,
                "end": 55,
                "label": "非限定定语从句 , which has achieved... — 已取得的成就",
                "type": "non-restrictive"
              },
              {
                "start": 50,
                "end": 55,
                "label": "具象短语 against all odds — 克服万难",
                "type": "concrete-imagery"
              },
              {
                "start": 76,
                "end": 105,
                "label": "形容词 even more prosperous + inclusive — 更繁荣包容",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 10,
        "role": "结论收尾",
        "chainType": "time-layer",
        "tip": "真情实感收尾，回应开头'我来自武汉'，用排比或升华句让结尾令人印象深刻。",
        "vocab": [
          "In a word, To sum up, Above all",
          "proud of, grateful for, deeply attached to",
          "my roots, my home, where my heart belongs"
        ],
        "patterns": [
          "In a word, my hometown is not just a place — it is ___, and I am proud to call it home.",
          "Above all, no matter how far I travel, ___ will always be where my heart truly belongs."
        ],
        "grammar": "not just...but 升华；no matter how far 让步",
        "discovery": {
          "a": {
            "text": "In a word, Wuhan is not simply a city on a map to me — it is my roots, my pride, and the place that has quietly shaped me into the person I am today.",
            "highlights": [
              {
                "start": 0,
                "end": 9,
                "label": "In a word 总结信号",
                "type": "connector"
              },
              {
                "start": 18,
                "end": 26,
                "label": "副词 simply — 不仅仅",
                "type": "adverb"
              },
              {
                "start": 48,
                "end": 62,
                "label": "名词三连排 roots, pride, place — 三重定义",
                "type": "concrete-feeling"
              },
              {
                "start": 80,
                "end": 93,
                "label": "副词 quietly + Change核 shaped — 安静塑造",
                "type": "change-verb"
              },
              {
                "start": 94,
                "end": 105,
                "label": "the person I am today — 今天的我",
                "type": "concrete-feeling"
              }
            ]
          },
          "b": {
            "text": "Above all, no matter how far I travel or how much I change over the years, Wuhan — this loud, warm, unstoppable city of rivers — will forever remain the place where my heart truly belongs.",
            "highlights": [
              {
                "start": 0,
                "end": 9,
                "label": "Above all 最高级信号 — 最重要的",
                "type": "connector"
              },
              {
                "start": 10,
                "end": 28,
                "label": "no matter how far + how much 双让步从句",
                "type": "connector"
              },
              {
                "start": 43,
                "end": 68,
                "label": "形容词三连排 loud, warm, unstoppable — 城市性格",
                "type": "concrete-imagery"
              },
              {
                "start": 50,
                "end": 68,
                "label": "同位语 city of rivers — 呼应开头",
                "type": "concrete-imagery"
              },
              {
                "start": 82,
                "end": 97,
                "label": "副词 forever + where 从句 — 永远归属之地",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "id": 5,
    "year": "2020仿写",
    "title": "My Hobby",
    "emoji": "🎨",
    "theme": "介绍你的爱好及它对你的影响",
    "color": "#fff1f2",
    "accent": "#be123c",
    "light": "#ffe4e6",
    "opening": "Having a hobby can make our life more colourful and meaningful.",
    "sentences": [
      {
        "id": 2,
        "role": "点明爱好",
        "chainType": "argument",
        "tip": "直接点明你的爱好，加 ever since / as long as I can remember 说明爱好的持久性，体现真实热爱。",
        "vocab": [
          "reading, painting, playing guitar, photography",
          "ever since, as long as I can remember, from an early age",
          "passionate about, crazy about, devoted to, fascinated by"
        ],
        "patterns": [
          "Ever since I was a child, I have been passionate about ___, spending hours every day ___.",
          "My hobby is ___, which I have loved for as long as I can remember."
        ],
        "grammar": "ever since + 过去时 → 现在完成时；which 非限制性",
        "discovery": {
          "a": {
            "text": "Ever since I was a little child, I have been deeply passionate about painting, spending countless quiet hours completely absorbed in creating worlds with colours and brushes.",
            "highlights": [
              {
                "start": 0,
                "end": 8,
                "label": "Ever since + 过去时 → 现在完成时 — 持久热爱",
                "type": "connector"
              },
              {
                "start": 22,
                "end": 33,
                "label": "副词 deeply — 深的程度",
                "type": "adverb"
              },
              {
                "start": 55,
                "end": 85,
                "label": "非谓语 spending...absorbed in... — 沉浸其中",
                "type": "non-finite"
              },
              {
                "start": 73,
                "end": 85,
                "label": "副词 completely + absorbed — 完全沉浸",
                "type": "adverb"
              },
              {
                "start": 85,
                "end": 105,
                "label": "具象画面 creating worlds with colours — 创造色彩世界",
                "type": "concrete-imagery"
              }
            ]
          },
          "b": {
            "text": "My greatest passion is painting, which I have loved for as long as I can remember — a quiet, magical activity that transforms a blank white canvas into a window of endless imagination.",
            "highlights": [
              {
                "start": 0,
                "end": 17,
                "label": "最高级 greatest passion — 最强的热情",
                "type": "concrete-feeling"
              },
              {
                "start": 18,
                "end": 50,
                "label": "非限定定语从句 , which I have loved... — 长久之爱",
                "type": "non-restrictive"
              },
              {
                "start": 50,
                "end": 69,
                "label": "同位语 + 形容词 quiet, magical activity",
                "type": "concrete-imagery"
              },
              {
                "start": 69,
                "end": 88,
                "label": "Change核 transforms...into — 转变",
                "type": "change-verb"
              },
              {
                "start": 80,
                "end": 100,
                "label": "具象对照 blank canvas → window of imagination",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 3,
        "role": "爱好起源",
        "chainType": "causality",
        "tip": "讲述你是如何开始这个爱好的——某人的影响或某次经历，过去时叙事，有起因有细节。",
        "vocab": [
          "it all started when, I first became interested when",
          "my teacher, my parents, a book, a film",
          "introduced me to, sparked my interest, inspired me"
        ],
        "patterns": [
          "It all started when ___, and from that moment on, I was completely ___.",
          "I first became interested in ___ after ___, who ___ and showed me how wonderful it could be."
        ],
        "grammar": "It all started when 过去时叙事；after + 动名词",
        "discovery": {
          "a": {
            "text": "It all started when my grandfather quietly placed a worn paintbrush in my tiny hand and patiently showed me how to paint my very first flower on a sunny afternoon.",
            "highlights": [
              {
                "start": 0,
                "end": 16,
                "label": "It all started when 叙事开端",
                "type": "connector"
              },
              {
                "start": 26,
                "end": 40,
                "label": "副词 quietly + 具象 worn paintbrush — 旧画笔的温情",
                "type": "adverb"
              },
              {
                "start": 41,
                "end": 56,
                "label": "具象名词 tiny hand — 小手",
                "type": "concrete-imagery"
              },
              {
                "start": 60,
                "end": 75,
                "label": "副词 patiently — 耐心地",
                "type": "adverb"
              },
              {
                "start": 93,
                "end": 110,
                "label": "具象细节 first flower + sunny afternoon",
                "type": "specific-detail"
              }
            ]
          },
          "b": {
            "text": "I first fell in love with painting after watching my grandfather, a quiet man whose rough hands could create the most delicate watercolour landscapes, which seemed to breathe with life on the paper.",
            "highlights": [
              {
                "start": 0,
                "end": 20,
                "label": "fell in love with + after watching — 爱的开始",
                "type": "connector"
              },
              {
                "start": 38,
                "end": 68,
                "label": "同位语 + whose 定语从句 + 对比 rough hands → delicate landscapes",
                "type": "connector"
              },
              {
                "start": 51,
                "end": 68,
                "label": "最高级 most delicate + 具象 watercolour landscapes",
                "type": "concrete-imagery"
              },
              {
                "start": 69,
                "end": 95,
                "label": "非限定定语从句 , which seemed to breathe... — 栩栩如生",
                "type": "non-restrictive"
              },
              {
                "start": 78,
                "end": 95,
                "label": "具象比喻 breathe with life — 活过来了",
                "type": "concrete-imagery"
              }
            ]
          }
        }
      },
      {
        "id": 4,
        "role": "具体描写①",
        "chainType": "causality",
        "tip": "描写你进行这项爱好时的具体动作和感受，用现在时或现在进行时，让读者身临其境。",
        "vocab": [
          "whenever I, every time I, as soon as I",
          "focus, concentrate, immerse myself in, lose track of time",
          "peaceful, energised, alive, completely absorbed"
        ],
        "patterns": [
          "Whenever I ___, I feel completely at peace, as if the rest of the world ___.",
          "As soon as I start ___, I lose track of time and become fully absorbed in ___."
        ],
        "grammar": "Whenever 时间从句；as if 虚拟语气",
        "discovery": {
          "a": {
            "text": "Whenever I sit down to paint, I completely lose myself in the rhythm of brushstrokes, carefully mixing colours and quietly watching shapes emerge slowly on the blank paper.",
            "highlights": [
              {
                "start": 0,
                "end": 8,
                "label": "Whenever 时间从句 — 每次画画时",
                "type": "connector"
              },
              {
                "start": 22,
                "end": 35,
                "label": "副词 completely + lose myself — 彻底沉浸",
                "type": "adverb"
              },
              {
                "start": 36,
                "end": 62,
                "label": "具象名词 rhythm of brushstrokes — 笔触的节奏",
                "type": "concrete-imagery"
              },
              {
                "start": 63,
                "end": 90,
                "label": "非谓语 mixing...watching... 双动作链",
                "type": "non-finite"
              },
              {
                "start": 72,
                "end": 82,
                "label": "副词 carefully + quietly — 细致安静",
                "type": "adverb"
              }
            ]
          },
          "b": {
            "text": "As soon as I open my paint box and pick up a brush, the noisy world outside fades into silence, and I enter a peaceful, colourful universe where time seems to stand perfectly still.",
            "highlights": [
              {
                "start": 0,
                "end": 22,
                "label": "As soon as 时间从句 + 具体动作 open + pick up",
                "type": "connector"
              },
              {
                "start": 28,
                "end": 58,
                "label": "具象对比 noisy world → silence — 喧嚣到寂静",
                "type": "concrete-imagery"
              },
              {
                "start": 59,
                "end": 87,
                "label": "形容词 peaceful, colourful + 具象 universe",
                "type": "concrete-imagery"
              },
              {
                "start": 87,
                "end": 105,
                "label": "where 定语从句 + 副词 perfectly — 时间静止",
                "type": "connector"
              },
              {
                "start": 96,
                "end": 105,
                "label": "副词 perfectly + stand still — 完美静止",
                "type": "adverb"
              }
            ]
          }
        }
      },
      {
        "id": 5,
        "role": "具体描写②",
        "chainType": "causality",
        "tip": "从另一角度描写这个爱好，写一次具体成果或进步，体现努力和成长，过去时或完成时。",
        "vocab": [
          "after months of practice, eventually, finally",
          "achieved, accomplished, created, produced, mastered",
          "proud of, satisfied with, amazed at my own progress"
        ],
        "patterns": [
          "After months of practice, I finally ___, which gave me an enormous sense of achievement.",
          "I remember the first time I ___, and I felt so ___ that I knew I would never give it up."
        ],
        "grammar": "after + 时间段；which 引出结果；felt so...that",
        "discovery": {
          "a": {
            "text": "After months of practising patiently, I finally completed my first detailed painting of our garden, and I felt so genuinely proud that I hung it on my wall immediately.",
            "highlights": [
              {
                "start": 0,
                "end": 22,
                "label": "after + 时间段 + 副词 patiently — 长期耐心练习",
                "type": "adverb"
              },
              {
                "start": 29,
                "end": 36,
                "label": "副词 finally — 终于",
                "type": "adverb"
              },
              {
                "start": 45,
                "end": 72,
                "label": "具象名词 detailed painting of our garden — 具体作品",
                "type": "specific-detail"
              },
              {
                "start": 82,
                "end": 97,
                "label": "副词 genuinely + proudly — 真实的骄傲",
                "type": "adverb"
              },
              {
                "start": 98,
                "end": 120,
                "label": "so...that 结果从句 + 副词 immediately — 立刻挂墙",
                "type": "connector"
              }
            ]
          },
          "b": {
            "text": "I remember the unforgettable moment when I finished my first landscape painting — an imperfect yet beautiful scene of sunset over East Lake, which filled me with such a powerful sense of achievement that I knew painting would be part of my life forever.",
            "highlights": [
              {
                "start": 0,
                "end": 27,
                "label": "I remember + when 定语从句 + 形容词 unforgettable — 难忘时刻",
                "type": "connector"
              },
              {
                "start": 46,
                "end": 85,
                "label": "具象画面 imperfect yet beautiful sunset over East Lake",
                "type": "concrete-imagery"
              },
              {
                "start": 60,
                "end": 68,
                "label": "形容词 imperfect yet beautiful — 不完美但美",
                "type": "concrete-feeling"
              },
              {
                "start": 85,
                "end": 105,
                "label": "非限定定语从句 , which filled me... — 成就感的冲击",
                "type": "non-restrictive"
              },
              {
                "start": 89,
                "end": 105,
                "label": "具象表达 powerful sense of achievement",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 6,
        "role": "爱好的益处",
        "chainType": "argument",
        "tip": "写爱好给你带来的具体益处（不止一点），用 not only...but also 并列，展示多角度思维。",
        "vocab": [
          "not only...but also, in addition to",
          "relieve stress, improve concentration, develop creativity",
          "patience, discipline, imagination, resilience"
        ],
        "patterns": [
          "My hobby not only helps me ___, but also teaches me ___ that is valuable in every area of life.",
          "In addition to ___, ___ has also helped me develop ___ and become more ___."
        ],
        "grammar": "not only...but also 并列；that 定语从句",
        "discovery": {
          "a": {
            "text": "Painting not only helps me relieve stress after a long school day, but it has also gradually taught me patience and the quiet power of focusing deeply on one thing at a time.",
            "highlights": [
              {
                "start": 0,
                "end": 13,
                "label": "not only helps... — 第一益处",
                "type": "connector"
              },
              {
                "start": 14,
                "end": 38,
                "label": "具象动词 relieve stress + 时间 after a long school day",
                "type": "concrete-imagery"
              },
              {
                "start": 47,
                "end": 70,
                "label": "副词 gradually + Mind核 taught — 逐渐教会",
                "type": "mind-verb"
              },
              {
                "start": 78,
                "end": 92,
                "label": "副词 deeply — 深度专注",
                "type": "adverb"
              },
              {
                "start": 71,
                "end": 93,
                "label": "具象名词 patience + quiet power of focusing",
                "type": "concrete-feeling"
              }
            ]
          },
          "b": {
            "text": "My hobby has brought me far more than just beautiful pictures — it has given me patience when things go wrong, creativity when ideas run dry, and a peaceful corner of life that no exam or test can ever disturb.",
            "highlights": [
              {
                "start": 0,
                "end": 15,
                "label": "far more than just — 远不止",
                "type": "connector"
              },
              {
                "start": 34,
                "end": 57,
                "label": "when 从句对比 go wrong / run dry — 画坏/没灵感时",
                "type": "connector"
              },
              {
                "start": 58,
                "end": 80,
                "label": "具象名词 patience + creativity — 两种品质",
                "type": "concrete-feeling"
              },
              {
                "start": 80,
                "end": 100,
                "label": "具象比喻 peaceful corner of life — 不可打扰的角落",
                "type": "concrete-imagery"
              },
              {
                "start": 100,
                "end": 115,
                "label": "that 定语从句 + no exam can disturb — 考试无法干扰",
                "type": "connector"
              }
            ]
          }
        }
      },
      {
        "id": 7,
        "role": "与他人分享",
        "chainType": "causality",
        "tip": "写你与朋友或家人分享这个爱好的经历，体现爱好的社交价值，用间接引语或描写。",
        "vocab": [
          "share with, introduce to, teach, inspire",
          "my friends, my family, my classmates",
          "together, side by side, with great enthusiasm"
        ],
        "patterns": [
          "I have even shared my love of ___ with ___, who quickly became ___ themselves.",
          "My ___ once told me that watching me ___ inspired her/him to ___, which made me feel truly ___."
        ],
        "grammar": "现在完成时；who 定语从句；which 结果",
        "discovery": {
          "a": {
            "text": "I have happily shared my love of painting with my best friend, who initially knew nothing about art but gradually became just as passionate as I am.",
            "highlights": [
              {
                "start": 0,
                "end": 10,
                "label": "现在完成时 have shared — 持续的分享",
                "type": "connector"
              },
              {
                "start": 10,
                "end": 18,
                "label": "副词 happily — 快乐地",
                "type": "adverb"
              },
              {
                "start": 40,
                "end": 59,
                "label": "who 定语从句 + 副词 initially",
                "type": "connector"
              },
              {
                "start": 60,
                "end": 75,
                "label": "副词 initially + gradually — 从无到有的转变",
                "type": "adverb"
              },
              {
                "start": 76,
                "end": 92,
                "label": "比较级 just as passionate as — 同样热爱",
                "type": "concrete-feeling"
              }
            ]
          },
          "b": {
            "text": "My mother once told me, with tears glistening in her eyes, that watching me paint so wholeheartedly reminded her of her own forgotten dreams, which inspired her to pick up a brush again after thirty years.",
            "highlights": [
              {
                "start": 0,
                "end": 28,
                "label": "间接引语 told me that + 具象 tears glistening",
                "type": "concrete-imagery"
              },
              {
                "start": 16,
                "end": 28,
                "label": "具象细节 tears glistening — 泪光闪烁",
                "type": "concrete-imagery"
              },
              {
                "start": 48,
                "end": 63,
                "label": "副词 wholeheartedly — 全心全意",
                "type": "adverb"
              },
              {
                "start": 72,
                "end": 90,
                "label": "具象名词 forgotten dreams — 遗忘的梦想",
                "type": "concrete-feeling"
              },
              {
                "start": 90,
                "end": 115,
                "label": "非限定定语从句 , which inspired... — 重新拿起画笔",
                "type": "non-restrictive"
              }
            ]
          }
        }
      },
      {
        "id": 8,
        "role": "克服困难",
        "chainType": "causality",
        "tip": "诚实写出过程中遇到的困难以及如何克服，展示毅力和成长，no matter how 让步结构可加分。",
        "vocab": [
          "no matter how difficult, even when, despite",
          "give up, persist, keep going, try again",
          "determination, perseverance, patience, willpower"
        ],
        "patterns": [
          "There were times when I wanted to give up, but I kept going because ___.",
          "No matter how difficult ___ seemed, I always reminded myself that ___ and tried again."
        ],
        "grammar": "There were times when 定语从句；No matter how 让步",
        "discovery": {
          "a": {
            "text": "There were countless times when I wanted to throw my brush down in frustration, but I stubbornly kept going because every failed painting silently taught me something new.",
            "highlights": [
              {
                "start": 0,
                "end": 18,
                "label": "There were times when 定语从句 — 困难时刻",
                "type": "connector"
              },
              {
                "start": 10,
                "end": 18,
                "label": "形容词 countless — 无数次",
                "type": "concrete-imagery"
              },
              {
                "start": 36,
                "end": 50,
                "label": "具象动词 throw my brush down — 摔画笔",
                "type": "concrete-imagery"
              },
              {
                "start": 60,
                "end": 75,
                "label": "副词 stubbornly — 固执地坚持",
                "type": "adverb"
              },
              {
                "start": 90,
                "end": 105,
                "label": "副词 silently + Mind核 taught — 静静地教会",
                "type": "mind-verb"
              }
            ]
          },
          "b": {
            "text": "No matter how frustrating it felt to ruin a painting I had worked on for hours, I always reminded myself that even the greatest artists started somewhere — a truth, which I now carry with me whenever I face any difficulty in life.",
            "highlights": [
              {
                "start": 0,
                "end": 28,
                "label": "No matter how + frustrating — 让步结构",
                "type": "connector"
              },
              {
                "start": 18,
                "end": 28,
                "label": "具象动词 ruin + 定语从句 worked on for hours",
                "type": "concrete-imagery"
              },
              {
                "start": 42,
                "end": 72,
                "label": "Mind核 reminded myself + that 宾语从句 — 自我提醒",
                "type": "mind-verb"
              },
              {
                "start": 80,
                "end": 105,
                "label": "非限定定语从句 , which I now carry... — 带走真理",
                "type": "non-restrictive"
              },
              {
                "start": 90,
                "end": 105,
                "label": "具象动词 carry + whenever 从句 — 随行到任何困难",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      },
      {
        "id": 9,
        "role": "爱好的更深意义",
        "chainType": "time-layer",
        "tip": "从个人爱好升华到对生活态度的影响，I have come to realise / I now believe 体现成长式思考。",
        "vocab": [
          "I have come to realise, I now believe, I have learned",
          "more than just a hobby, a way of life, a window to the world",
          "patience, creativity, the joy of making something"
        ],
        "patterns": [
          "I have come to realise that ___ is more than just a hobby — it is a way to ___ and understand ___.",
          "Through ___, I have learned that ___, a lesson that has shaped the way I see ___."
        ],
        "grammar": "现在完成时 I have come to；that 宾语从句；a lesson that 同位语从句",
        "discovery": {
          "a": {
            "text": "I have slowly come to realise that painting is far more than just a hobby — it is a quiet way to understand myself more deeply and see the hidden beauty in ordinary moments.",
            "highlights": [
              {
                "start": 0,
                "end": 16,
                "label": "现在完成时 I have come to realise — 成长式认知",
                "type": "mind-verb"
              },
              {
                "start": 6,
                "end": 13,
                "label": "副词 slowly — 逐渐地",
                "type": "adverb"
              },
              {
                "start": 34,
                "end": 54,
                "label": "far more than just — 远不止",
                "type": "connector"
              },
              {
                "start": 67,
                "end": 90,
                "label": "非谓语 to understand... — 理解自己",
                "type": "non-finite"
              },
              {
                "start": 78,
                "end": 90,
                "label": "副词 deeply + 具象 hidden beauty in ordinary moments",
                "type": "adverb"
              }
            ]
          },
          "b": {
            "text": "Painting has become, to me, far more than just a pastime — it is a lens through which I now view the world, a quiet teacher whose lessons about patience, persistence, and finding beauty in imperfection have quietly reshaped who I am.",
            "highlights": [
              {
                "start": 0,
                "end": 16,
                "label": "Change核 has become — 已经成为",
                "type": "change-verb"
              },
              {
                "start": 44,
                "end": 68,
                "label": "具象比喻 a lens through which I view the world — 看世界的镜头",
                "type": "concrete-imagery"
              },
              {
                "start": 68,
                "end": 90,
                "label": "同位语 a quiet teacher + whose 定语从句",
                "type": "connector"
              },
              {
                "start": 82,
                "end": 105,
                "label": "具象名词三连排 patience, persistence, finding beauty",
                "type": "concrete-feeling"
              },
              {
                "start": 100,
                "end": 115,
                "label": "副 quietly + Change核 reshaped — 安静重塑",
                "type": "change-verb"
              }
            ]
          }
        }
      },
      {
        "id": 10,
        "role": "结论收尾",
        "chainType": "time-layer",
        "tip": "热情有力地收尾，用邀请/建议语气鼓励读者也寻找爱好，与开头主题句形成完美呼应。",
        "vocab": [
          "In a word, To sum up, I truly believe",
          "find your passion, discover what you love",
          "make life richer, fuller, more worth living"
        ],
        "patterns": [
          "In a word, ___ has made my life ___, and I truly believe everyone deserves to find their own passion.",
          "I hope that anyone who reads this will be inspired to ___, for a good hobby can truly ___."
        ],
        "grammar": "I truly believe + that 宾语从句；for 引出原因",
        "discovery": {
          "a": {
            "text": "In a word, painting has truly made my life richer and more meaningful, and I wholeheartedly believe that everyone deserves to find their own quiet passion that makes time stand still.",
            "highlights": [
              {
                "start": 0,
                "end": 9,
                "label": "In a word 总结信号 — 呼应开头",
                "type": "connector"
              },
              {
                "start": 20,
                "end": 25,
                "label": "副词 truly — 真正地",
                "type": "adverb"
              },
              {
                "start": 26,
                "end": 45,
                "label": "比较级 richer + more meaningful — 双重变化",
                "type": "change-verb"
              },
              {
                "start": 50,
                "end": 63,
                "label": "副词 wholeheartedly — 全心全意",
                "type": "adverb"
              },
              {
                "start": 64,
                "end": 95,
                "label": "I believe that 宾语从句 + 具象 makes time stand still",
                "type": "object-clause"
              }
            ]
          },
          "b": {
            "text": "I sincerely hope that anyone who reads this will be inspired to discover their own special passion — that one activity, which makes the noisy world go quiet and fills the heart with a joy that words can hardly describe.",
            "highlights": [
              {
                "start": 0,
                "end": 14,
                "label": "I sincerely hope that 宾语从句 — 真诚号召",
                "type": "object-clause"
              },
              {
                "start": 2,
                "end": 11,
                "label": "副词 sincerely — 真诚地",
                "type": "adverb"
              },
              {
                "start": 40,
                "end": 60,
                "label": "具象名词 special passion + 同位语 that one activity",
                "type": "concrete-feeling"
              },
              {
                "start": 61,
                "end": 90,
                "label": "非限定定语从句 , which makes...go quiet — 使世界安静",
                "type": "non-restrictive"
              },
              {
                "start": 76,
                "end": 90,
                "label": "具象对比 noisy world → quiet",
                "type": "concrete-imagery"
              },
              {
                "start": 91,
                "end": 110,
                "label": "具象表达 joy that words can hardly describe — 难以言说的快乐",
                "type": "concrete-feeling"
              }
            ]
          }
        }
      }
    ]
  }
];

export default TOPICS;
