cd /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/project/mofangyouliERP
svn up
echo "svn 更新完成"
if [[ $1 = "prev" ]]
then
 npm run dev
 echo "预发布打包完成"
 rm -rf /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/static/mod/mfylERP/static/*
 echo "静态资源删除完成"
 cp -r /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/project/mofangyouliERP/dev/static/* /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/static/mod/mfylERP/static/
 echo "静态资源拷贝完成"
 rm /home/www/web-deploy/source-code/jujibao/com.benefit.parent/com-benefit-admin-web/src/main/resources/templates/index.html
 echo "模版删除完成"
 cp /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/project/mofangyouliERP/dev/index.html /home/www/web-deploy/source-code/jujibao/com.benefit.parent/com-benefit-admin-web/src/main/resources/templates/
 echo "模版拷贝完成"
 cd /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/static/mod/mfylERP/
 scp -r static/ www@prev-web01:/mnt/static/preview/static/mod/mfylERP/
 echo "预发布资源发布完成"
 cd /home/www/web-deploy/source-code/jujibao/com.benefit.parent/com-benefit-admin-web/src/main/resources/templates
 scp index.html www@prev-web03:/home/www/web-deploy/deploy/bea.guijitech.com/templates
 echo "预发布模版发布完成"
 echo "预发布完成"
elif [[ $1 = "line" ]]
then
 npm run build
 echo "线上打包完成"
 rm -rf /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/static/mod/mfylERP/static/*
 echo "静态资源删除完成"
 cp -r /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/project/mofangyouliERP/dist/static/* /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/static/mod/mfylERP/static/
 echo "静态资源拷贝完成"
 rm /home/www/web-deploy/source-code/jujibao/com.benefit.parent/com-benefit-admin-web/src/main/resources/templates/index.html
 echo "模版删除完成"
 cp /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/project/mofangyouliERP/dist/index.html /home/www/web-deploy/source-code/jujibao/com.benefit.parent/com-benefit-admin-web/src/main/resources/templates
 echo "模版拷贝完成"
 cd /home/www/web-deploy/source-code/kuaiqiang/s1.91kuaiqiang.com/static/mod/mfylERP/
 scp -r static/ www@jjb-web02:/mnt/static/static/mod/mfylERP
 echo "线上资源发布完成"
 cd /home/www/web-deploy/source-code/jujibao/com.benefit.parent/com-benefit-admin-web/src/main/resources/templates
 scp index.html www@vip-web01:/home/www/web-deploy/deploy/bea.guijitech.com/templates
 scp index.html www@vip-web02:/home/www/web-deploy/deploy/bea.guijitech.com/templates
 echo "线上模版发布完成"
 echo "线上发布完成"
else
 echo "发布参数错误或者无发布参数请确认"
fi

