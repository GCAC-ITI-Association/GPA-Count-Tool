
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        wx.request({
        
            url: 'https://pv.sohu.com/cityjson?ie=utf-8',
        
            success(res){
        
                var m = JSON.parse(res.data.match(/.*(\{[^\}]+\}).*/)[1] || '{}')
        
                console.log('ip =>', m.cip, m)
        
            }
        
        })

    },

    Button_ZNSC(){
        wx.navigateTo({
          url: '../index/index',
        })
    },

    Button_KSJS(){
        wx.navigateTo({
            url: '../standard/index',
        })
    },

    Button_BCLS(){
        wx.navigateTo({
            url: '../saveList/index',
        })
    },

    Image_Show(){
        wx.previewImage({
            urls: ['cloud://itia-gpa-7gzulj5z00db6cdf.6974-itia-gpa-7gzulj5z00db6cdf-1316536221/itiagzh.jpg'] // 需要预览的图片 http 链接列表
        })
    }


})