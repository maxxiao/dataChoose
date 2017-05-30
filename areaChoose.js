/**
 * Created by maxiao on 2017/5/23.
 */
//配置示例
/*var selectData = [{
        node:$("#province"),
        url:"../se_cusStation.page?cmd=queryProvince",
        paramsFld:[],
        optionConfig:{
            valFld:"provincecode",
            nameFld:"provincename"
        }
    },{
        node:$("#city"),
        url:"../se_cusStation.page?cmd=queryCity",
        paramsFld:["query.provinceCode"],
        optionConfig:{
            valFld:"citycode",
            nameFld:"cityname"
        }
    },{
        node:$("#area"),
        url:"../se_cusStation.page?cmd=queryCounty",
        paramsFld:["query.provinceCode","query.cityCode"],
        optionConfig:{
            valFld:"countycode",
            nameFld:"countyname"
        }
    },{
        node:$("#town"),
        url:"../se_cusStation.page?cmd=queryTown",
        paramsFld:["query.provinceCode","query.cityCode","query.countyCode"],
        optionConfig:{
            valFld:"towncode",
            nameFld:"townname"
        }
    }]*/
function areaChoose(params){

    this.data = params;
    var that = this;

    var deferred = this.getData(0);
    //设置默认值
    for(var i = 0 ; i < this.data.length; i ++){

        var j = 0
        if(that.data[i].defaultVal) {
            deferred = deferred.then(function () {

                that.data[j].node.val(that.data[j].defaultVal)
                if(++j < that.data.length)return that.getData(j)
            });
        }
    }
    //on事件绑定
    for (var i = 0;i < this.data.length-1; i ++){
        $(this.data[i].node).on("change",(function(j){

            return function(){
                that.getData(++j)
            }
        })(i));
    }

}
areaChoose.prototype = {
    getData:function(index){

        var data = {};
        if(this.data[index].paramsFld)
            for (var i = 0 ; i < this.data[index].paramsFld.length;i++){
                 data[this.data[index].paramsFld[i]] = $(this.data[i].node).val();
            }
        var  that = this
        return $.ajax({url:this.data[index].url,
                'data':data})
            .success(function (responseText) {

                that.resetSelect(index)
                var data = responseText
                if(typeof  responseText == "string"){

                    data = JSON.parse( responseText.substr( responseText.indexOf("{")));
                }
                that.setOption(index,data.data)

            })
    },
    resetSelect:function(index){

        for(;index < this.data.length;index++){
            this.setOption(index)
            if(this.data[index].node.find("option").length > 0)
                this.data[index].node.find("option")[0].selected = true;
        }
    },
    setOption:function(index,data){

        if(!data)data = [];
        var optionConfig = this.data[index].optionConfig;
        var inHtml = "<option value=''   >请选择</option>"
        for (var i = 0 ; i < data.length ; i ++){

            inHtml += "<option value='"+ data[i][optionConfig.valFld]  +"' >"+data[i][optionConfig.nameFld]+"</option>"
        }
        this.data[index].node.html(inHtml);
    }
};
