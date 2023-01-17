
var app = getApp()
Page({

    data:{
        type: 'jw'
    },

    onLoad: function(o){

    },

    Input_nameInput(res){
        app.globalData.Name = res.detail.value
    },

    radioChange(res){
        this.setData({
            type: res.detail.value
        })
    },

    Button_Tip(){
        wx.navigateTo({
            url: '../smartTip/index',
        })
    },

    Button_Select(){ //选择成绩单按钮

        var type = this.data.type
        var that = this
        var haveNaN = false //记录是否出现了无法识别的数据
        //调用接口选择图片
        wx.chooseMedia({
          mediaType: ['image'],
          sourceType: ['album'],
          count: 1,
          success(res){

            //显示处理加载
            wx.showLoading({
                title: '正在处理',
            })

            //调用OCR处理图片
            wx.serviceMarket.invokeService({
                service: "wx79ac3de8be320b71",
                api: "OcrAllInOne",
                data: {
                    img_url: new wx.serviceMarket.CDN({
                        type: "filePath",
                        filePath: res.tempFiles[0].tempFilePath
                    }),
                    data_type: 3,
                    ocr_type: 8
                }

            }).then(res => {

                //将OCR处理结果再次处理生成绩点表
                var GPAlst = []
                var jc = 0

                app.globalData.source = 'creat'

                if(type == 'jw'){ //教务模式

                    //处理结果
                    for (const item in res.data.ocr_comm_res.items) {

                        var changeVal = 0
                        var text = res.data.ocr_comm_res.items[item - changeVal].text
                        

                        //#region 防呆处理
                        if(
                            text == '2022-2023' || 
                            text == '2023-2024' || 
                            text == '2024-2025' || 
                            text == '第一学期' || 
                            text == '第二学期' || 
                            text == '学分' || 
                            text == '绩点' || 
                            text == '学分 成绩 绩点' || 
                            text == '注:凡课程绩点“0”，则该课程成绩为补考后成绩' || 
                            text == '课程名称' || 
                            text == '学期' || 
                            text == '总评成绩' || 
                            text == '分离' || 
                            text == '2022-2023学年第1学期' || 
                            text == '2022-2023学年第2学期' || 
                            text == '2023-2024学年第1学期' || 
                            text == '2023-2024学年第2学期' || 
                            text == '课程成绩' || 
                            text == '等级考试成绩' ||
                            text == '成绩查询'
                        ){
                            continue
                        }
                        //#endregion

                        jc += 1
                        if(jc == 1){
                            GPAlst.push({'name' : res.data.ocr_comm_res.items[item - changeVal].text})
                            continue
                        }
                        if(jc == 2){
                            
                            //判定是不是同一行数据，如果不是则插入补充要求并回退指针
                            if(res.data.ocr_comm_res.items[item - changeVal].pos.left_top.y - res.data.ocr_comm_res.items[item - 1 - changeVal].pos.left_top.y > 15 || Number(res.data.ocr_comm_res.items[item - changeVal].text) > 10){
                                changeVal += 1
                                GPAlst[GPAlst.length - 1]['credit'] = '<!补充学分!>'
                                haveNaN = true
                                continue
                            }

                            if(!isNaN(res.data.ocr_comm_res.items[item - changeVal].text)){
                                GPAlst[GPAlst.length - 1]['credit'] = Number(res.data.ocr_comm_res.items[item - changeVal].text)
                                continue
                            }
                            GPAlst[GPAlst.length - 1]['credit'] = '<!补充学分!>'
                            haveNaN = true
                            continue
                        }
                        if(jc == 3){
                            if(res.data.ocr_comm_res.items[item - changeVal].pos.left_top.y - res.data.ocr_comm_res.items[item - 1 - changeVal].pos.left_top.y > 15){
                                changeVal += 1
                                GPAlst[GPAlst.length - 1]['score'] = '<!补充成绩!>'
                                haveNaN = true
                                continue
                            }

                            if(!isNaN(res.data.ocr_comm_res.items[item - changeVal].text)){
                                GPAlst[GPAlst.length - 1]['score'] = Number(res.data.ocr_comm_res.items[item - changeVal].text)
                                continue
                            }
                            GPAlst[GPAlst.length - 1]['score'] = '<!补充成绩!>'
                            haveNaN = true
                            continue
                        }
                        if(jc == 4){
                            console.log(res.data.ocr_comm_res.items[item - changeVal].pos.left_top.y - res.data.ocr_comm_res.items[item - 1 - changeVal].pos.left_top.y > 15)
                            console.log(res.data.ocr_comm_res.items[item - changeVal].pos.left_top.y, res.data.ocr_comm_res.items[item - 1 - changeVal].pos.left_top.y)
                            if(res.data.ocr_comm_res.items[item - changeVal].pos.left_top.y - res.data.ocr_comm_res.items[item - 1 - changeVal].pos.left_top.y > 15){
                                changeVal += 1
                                GPAlst[GPAlst.length - 1]['GP'] = '<!补充绩点!>'
                                haveNaN = true
                                jc = 0
                                continue
                            }

                            if(!isNaN(res.data.ocr_comm_res.items[item - changeVal].text)){
                                GPAlst[GPAlst.length - 1]['GP'] = Number(res.data.ocr_comm_res.items[item - changeVal].text)
                                jc = 0
                                continue
                            }
                            GPAlst[GPAlst.length - 1]['GP'] = '<!补充绩点!>'
                            haveNaN = true
                            jc = 0
                            continue
                        }
                    }

                }else{ //微校模式

                    //处理结果
                    for (const item in res.data.ocr_comm_res.items) {

                        //#region 防呆处理
                        if(
                            text == '2022-2023' || 
                            text == '2023-2024' || 
                            text == '2024-2025' || 
                            text == '第一学期' || 
                            text == '第二学期' || 
                            text == '学分' || 
                            text == '绩点' || 
                            text == '学分 成绩 绩点' || 
                            text == '注:凡课程绩点“0”，则该课程成绩为补考后成绩' || 
                            text == '课程名称' || 
                            text == '学期' || 
                            text == '总评成绩' || 
                            text == '分离' || 
                            text == '2022-2023学年第1学期' || 
                            text == '2022-2023学年第2学期' || 
                            text == '2023-2024学年第1学期' || 
                            text == '2023-2024学年第2学期' || 
                            text == '课程成绩' || 
                            text == '等级考试成绩' ||
                            text == '成绩查询'
                        ){
                            continue
                        }
                        //#endregion

                        jc += 1
                        if(jc == 1){
                            GPAlst.push({'name' : res.data.ocr_comm_res.items[item].text})
                            continue
                        }
                        if(jc == 2){
                            var temp = res.data.ocr_comm_res.items[item].text.replace('学分:','').replace('绩点:','').split(' ')
                            GPAlst[GPAlst.length - 1]['credit'] = Number(temp[0])
                            GPAlst[GPAlst.length - 1]['GP'] = Number(temp[1])
                            continue
                        }
                        if(jc == 3){
                            var temp = res.data.ocr_comm_res.items[item].text.replace('分','')
                            GPAlst[GPAlst.length - 1]['score'] = Number(temp)
                            jc = 0
                            continue
                        }
                    }

                }
            
                //将结果保存至全局变量
                app.globalData.GPAlist = GPAlst
                wx.hideLoading() //结束处理中提示

                console.log(GPAlst)
                console.log(res.data.ocr_comm_res.items)

                if(haveNaN){ //如果出现无法识别的数字则询问是否要自行编辑
                    wx.showModal({
                        title: '提示',
                        content: '该图片存在无法正确识别的数据，是否要手动补充数据？若不补充则无法生成成绩单。',
                        success (res) {
                          if (res.confirm) {
                            
                            wx.navigateTo({ //切换至手动计算页面并传递数据
                                url: '../standard/index?name=' + app.globalData.Name + '&data=' + JSON.stringify(GPAlst),
                            })

                          } else if (res.cancel) {
                            console.log('用户点击取消')
                          }
                        }
                    })

                }else{

                    wx.navigateTo({
                        url: '../showGPA/index',
                    })

                }

                

            }).catch(err => {
                console.error('invokeService fail', err)
            })
            
          }

        })
    },

    Image_Show(){
        wx.previewImage({
            urls: ['cloud://itia-gpa-7gzulj5z00db6cdf.6974-itia-gpa-7gzulj5z00db6cdf-1316536221/itiagzh.jpg'] // 需要预览的图片 http 链接列表
        })
    }

})
