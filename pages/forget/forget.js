const header = require('../../utils/header');
const {URL} = require('../../utils/http');

Page({
    data: {

    },
    onLoad: function() {
    
            wx.login({
                success: function(code) {
                    console.log(code)
                }   
            })
        
    },
    change: function() {
        wx.request({
            url: `${URL}AccountManage/RetrievePassword`,
            data: {
                UserName: '',
                Password: '',
                AuthCode: ''
            },
            header: header,
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (result)=>{
                
            },
            fail: ()=>{},
            complete: ()=>{}
        });
    }
})