var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        GPAlist : app.globalData.GPAlist,
        ACS : 0,
        GPA : 0,
        Name : ''
    },


    CalculationACS(){ //计算平均学分成绩
        var data = app.globalData.GPAlist
        var sumCS = 0
        var sumCredit = 0

        for (let index = 0; index < data.length; index++) {
            sumCS += data[index].score * data[index].credit
            sumCredit += data[index].credit
        }
        
        return((sumCS / sumCredit).toFixed(2))
    },

    CalculationGPA(){ //计算平均学分绩点
        var data = app.globalData.GPAlist
        var sumGP = 0
        var sumCredit = 0

        for (let index = 0; index < data.length; index++) {
            sumGP += data[index].GP * data[index].credit
            sumCredit += data[index].credit
        }
        
        return((sumGP / sumCredit).toFixed(2))
    },

    onLoad: function (options) {
        this.setData({
            GPAlist: app.globalData.GPAlist,
            ACS: this.CalculationACS(),
            GPA: this.CalculationGPA(),
            Name: app.globalData.Name
        })

        
    },

    Button_Save(){
        if(wx.getStorageSync('save-gpa-list') == ''){
            wx.setStorageSync('save-gpa-list', [{'info': app.globalData.GPAlist, 'GPA': this.data.GPA, 'name': app.globalData.Name}])
            wx.showToast({
                title: '成功',
                icon: '保存成功',
                duration: 1500
            })
        }else{
            var temp = wx.getStorageSync('save-gpa-list')
            temp.push({'info': app.globalData.GPAlist, 'GPA': this.data.GPA, 'name': app.globalData.Name})
            wx.setStorageSync('save-gpa-list',temp)

            wx.showToast({
                title: '成功',
                icon: '保存成功',
                duration: 1500
            })
        }
    }

})