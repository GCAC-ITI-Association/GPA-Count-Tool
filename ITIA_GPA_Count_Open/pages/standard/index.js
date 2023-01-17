var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        scoreInfo: '',
        scoreData: '',
        userName: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.name != undefined){
            var data = JSON.parse(options.data)
            var temp = ''
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                if(index == data.length - 1){
                    temp += element.name + ' ' + element.credit + ' ' + element.score
                }else{
                    temp += element.name + ' ' + element.credit + ' ' + element.score + '\n'
                }
            }
            this.setData({
                scoreData: temp,
                userName: options.name,
                scoreInfo: temp
            })

            wx.showModal({
                title: '提示',
                content: '下面的大文本框中可能会出现<!补充XX!>的字样，如<!补充学分!>等，将要求补充的信息替换掉补充提示后点击计算即可。如果没有出现要补充的信息则直接点击计算即可。',
                showCancel: false
            })
              
        }
    },

    Input_nameInput(res){
        app.globalData.Name = res.detail.value
    },

    Textarea_InfoInput(res){
        this.setData({scoreInfo : res.detail.value})
    },

    Button_Get(){

        if(this.data.scoreInfo.indexOf('<!补充') != -1){
            wx.showToast({
              title: '有缺失未补充',
              icon: 'error'
            })
            return
        }

        var data = this.data.scoreInfo.split('\n')
        var GPAlst = []

        app.globalData.source = 'creat'

        for (let index = 0; index < data.length; index++) {
            var element = data[index].split(' ');

            var gp = Number(element[2]) / 10 - 5
            if(Number(element[2]) < 60){
                gp = 0
            }

            GPAlst.push({
                'name': element[0],
                'credit': Number(element[1]),
                'score': Number(element[2]),
                'GP': gp.toFixed(1)
            })
            
        }

        app.globalData.GPAlist = GPAlst
        console.log(app.globalData.GPAlist)
        wx.hideLoading() //结束处理中提示

        wx.navigateTo({
            url: '../showGPA/index',
        })
    }
})