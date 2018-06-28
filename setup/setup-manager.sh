#!/bin/bash

OMNEEDIA=/omneedia
OMNEEDIA_MANAGER=$OMNEEDIA/Manager

[ -d ".tmp" ] || mkdir .tmp
rm -rf .tmp/wgetrc || true
[ -d "$OMNEEDIA" ] || mkdir -p $OMNEEDIA

if [ -z "$PROXY_HOST" ]
then
    echo "use_proxy = off" >> .tmp/wgetrc
else
	echo "http_proxy = $PROXY_HOST" >> .tmp/wgetrc
	echo "https_proxy = $PROXY_HOST" >> .tmp/wgetrc
	echo "use_proxy = on" >> .tmp/wgetrc
	export http_proxy=$PROXY_HOST
	export https_proxy=$PROXY_HOST
    echo "Acquire::Proxy $PROXY_HOST;" >> /etc/apt.conf
	echo $PROXY_HOST >> $OMNEEDIA/.proxy
fi

apt-get update
apt-get --assume-yes install build-essential git curl libnuma-dev psmisc glances libaio-dev docker.io

wget -qO- https://raw.githubusercontent.com/Omneedia/setup/master/nodejs | bash -
apt-get install -y nodejs
sudo ln -s "$(which nodejs)" /usr/bin/node

if [ -z "$PROXY_HOST" ]
then
git config --global --unset http.proxy
npm config delete proxy
npm config delete https-proxy
else
git config --global http.proxy $PROXY_HOST
npm config set proxy $PROXY_HOST
npm config set https-proxy $PROXY_HOST
fi

git clone https://github.com/omneedia/prod.manager $OMNEEDIA_MANAGER

PUBLIC_IP="`wget -qO- http://ipinfo.io/ip`"
PRIVATE_IP="`ip route get 8.8.8.8 | awk '{print $NF; exit}'`"
echo $PUBLIC_IP > $OMNEEDIA_MANAGER/.ip

cd .tmp

[ -d "$OMNEEDIA_MANAGER/bin/nginx" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/nginx
[ -d "$OMNEEDIA_MANAGER/bin/nginx" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/nginx
[ -d "$OMNEEDIA_MANAGER/bin/nginx/modules" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/nginx/modules
[ -d "$OMNEEDIA_MANAGER/bin/../config/engines/nginx/" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/../config/engines/nginx/
[ -d "$OMNEEDIA_MANAGER/bin/logs/engines/nginx/" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/logs/engines/nginx/
[ -d "$OMNEEDIA_MANAGER/bin/logs/engines/nginx/" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/logs/engines/nginx/
[ -d "$OMNEEDIA_MANAGER/bin/../tmp/" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/../tmp/
[ -d "$OMNEEDIA_MANAGER/bin/nginx/lib/body" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/nginx/lib/body
[ -d "$OMNEEDIA_MANAGER/bin/nginx/lib/fastcgi" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/nginx/lib/fastcgi
[ -d "$OMNEEDIA_MANAGER/bin/nginx/lib/proxy" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/nginx/lib/proxy
[ -d "$OMNEEDIA_MANAGER/bin/nginx/lib/scgi" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/nginx/lib/scgi
[ -d "$OMNEEDIA_MANAGER/bin/nginx/lib/uwsgi" ]  || mkdir -p $OMNEEDIA_MANAGER/bin/nginx/lib/uwsgi

wget https://nginx.org/download/nginx-1.14.0.tar.gz && tar zxvf nginx-1.14.0.tar.gz
wget https://ftp.pcre.org/pub/pcre/pcre-8.40.tar.gz && tar xzvf pcre-8.40.tar.gz
wget http://www.zlib.net/zlib-1.2.11.tar.gz && tar xzvf zlib-1.2.11.tar.gz
wget https://www.openssl.org/source/openssl-1.1.0f.tar.gz && tar xzvf openssl-1.1.0f.tar.gz
rm -rf *.tar.gz
cd nginx-1.14.0
./configure --prefix=$OMNEEDIA_MANAGER/bin/nginx \
            --sbin-path=$OMNEEDIA_MANAGER/bin/nginx \
            --modules-path=$OMNEEDIA_MANAGER/bin/nginx/modules \
            --conf-path=$OMNEEDIA_MANAGER/bin/../config/engines/nginx/nginx.conf \
            --error-log-path=$OMNEEDIA_MANAGER/logs/engines/nginx/error.log \
            --http-log-path=$OMNEEDIA_MANAGER/logs/engines/nginx/access.log \
            --pid-path=$OMNEEDIA_MANAGER/tmp/nginx.pid \
            --lock-path=$OMNEEDIA_MANAGER/tmp/nginx.lock \
            --user=root \
            --group=root \
            --build=Ubuntu \
            --http-client-body-temp-path=$OMNEEDIA_MANAGER/bin/nginx/lib/body \
            --http-fastcgi-temp-path=$OMNEEDIA_MANAGER/bin/nginx/lib/fastcgi \
            --http-proxy-temp-path=$OMNEEDIA_MANAGER/bin/nginx/lib/proxy \
            --http-scgi-temp-path=$OMNEEDIA_MANAGER/bin/nginx/lib/scgi \
            --http-uwsgi-temp-path=$OMNEEDIA_MANAGER/bin/nginx/lib/uwsgi \
            --with-openssl=../openssl-1.1.0f \
            --with-openssl-opt=enable-ec_nistp_64_gcc_128 \
            --with-openssl-opt=no-nextprotoneg \
            --with-openssl-opt=no-weak-ssl-ciphers \
            --with-openssl-opt=no-ssl3 \
            --with-pcre=../pcre-8.40 \
            --with-pcre-jit \
            --with-zlib=../zlib-1.2.11 \
            --with-compat \
            --with-file-aio \
            --with-threads \
            --with-http_addition_module \
            --with-http_auth_request_module \
            --with-http_dav_module \
            --with-http_flv_module \
            --with-http_gunzip_module \
            --with-http_gzip_static_module \
            --with-http_mp4_module \
            --with-http_random_index_module \
            --with-http_realip_module \
            --with-http_slice_module \
            --with-http_ssl_module \
            --with-http_sub_module \
            --with-http_stub_status_module \
            --with-http_v2_module \
            --with-http_secure_link_module \
            --with-mail \
            --with-mail_ssl_module \
            --with-stream \
            --with-stream_realip_module \
            --with-stream_ssl_module \
            --with-stream_ssl_preread_module \
            --with-debug
make
make install

rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/fastcgi_params
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/fastcgi.conf.default
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/koi-utf
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/koi-win
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/mime.types.default
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/nginx.conf.default
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/scgi_params
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/scgi_params.default
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/uwsgi_params
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/uwsgi_params.default
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/win-utf
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/fastcgi_params.default
rm $OMNEEDIA_MANAGER/bin/../config/engines/nginx/fastcgi.conf

cd ..

[ -d "$OMNEEDIA_MANAGER/bin/nginx/lib" ] || mkdir $OMNEEDIA_MANAGER/bin/nginx/lib
[ -d "$OMNEEDIA_MANAGER/bin/nginx/lib/body" ] || mkdir $OMNEEDIA_MANAGER/bin/nginx/lib/body
[ -d "$OMNEEDIA_MANAGER/bin/nginx/modules" ] || mkdir $OMNEEDIA_MANAGER/bin/nginx/modules

rm -Rf openssl-1.1.0f
rm -Rf zlib-1.2.11
rm -Rf nginx-1.14.0
rm -Rf pcre-8.40

wget https://downloads.mariadb.com/MariaDB/mariadb-10.2.14/bintar-linux-x86_64/mariadb-10.2.14-linux-x86_64.tar.gz -O mariadb.tar.gz && tar zxvf mariadb.tar.gz
mv mariadb-10.2.14-linux-x86_64 $OMNEEDIA_MANAGER/bin/mysql
rm -Rf mariadb.tar.gz
[ -d "$OMNEEDIA_MANAGER/var/db" ] || mkdir -p $OMNEEDIA_MANAGER/var/db
[ -d "$OMNEEDIA_MANAGER/logs" ]  || mkdir -p $OMNEEDIA_MANAGER/logs
[ -d "$OMNEEDIA_MANAGER/config/engines/mysql" ]  || mkdir -p $OMNEEDIA_MANAGER/config/engines/mysql
[ -d "$OMNEEDIA_MANAGER/logs/engines/mysql" ]  || mkdir -p $OMNEEDIA_MANAGER/logs/engines/mysql
echo [mysqld] >> $OMNEEDIA_MANAGER/config/engines/mysql/my.cnf
echo sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES >> $OMNEEDIA_MANAGER/config/engines/mysql/my.cnf
echo max_allowed_packet=160M >> $OMNEEDIA_MANAGER/config/engines/mysql/my.cnf
echo innodb_force_recovery=0 >> $OMNEEDIA_MANAGER/config/engines/mysql/my.cnf
echo port=3334 >> $OMNEEDIA_MANAGER/config/engines/mysql/my.cnf
echo general_log_file        = ../../logs/engines/mysql/mysql.log >> $OMNEEDIA_MANAGER/config/engines/mysql/my.cnf
echo general_log             = 1 >> $OMNEEDIA_MANAGER/config/engines/mysql/my.cnf
echo bind-address = 0.0.0.0 >> $OMNEEDIA_MANAGER/config/engines/mysql/my.cnf
$OMNEEDIA_MANAGER/bin/mysql/scripts/mysql_install_db --user=root --basedir=$OMNEEDIA_MANAGER/bin/mysql --datadir=$OMNEEDIA_MANAGER/var/db
nohup $OMNEEDIA_MANAGER/bin/mysql/bin/mysqld --defaults-extra-file=$OMNEEDIA_MANAGER/config/engines/mysql/my.cnf --user=root --port=3334 --datadir=$OMNEEDIA_MANAGER/var/db/ --basedir=$OMNEEDIA_MANAGER/bin/mysql &>.log &
echo $! > .pid
rm .log
sleep 5
echo "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';" >> query.sql
$OMNEEDIA_MANAGER/bin/mysql/bin/mysql -h 127.0.0.1 -u root -P 3334 < query.sql
rm query.sql
PID=`cat .pid`
rm .pid
kill -9 $PID

wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-3.6.4.tgz && tar zxvf mongodb-linux-x86_64-ubuntu1604-3.6.4.tgz
rm -Rf mongodb-linux-x86_64-ubuntu1604-3.6.4.tgz
mv mongodb-linux-x86_64-ubuntu1604-3.6.4 $OMNEEDIA_MANAGER/bin/mongodb

cd ..
rm -Rf .tmp

docker swarm init --advertise-addr $PRIVATE_IP

TOKEN="`docker swarm join-token manager -q`"
TOKEN_WORKER="`docker swarm join-token worker -q`"
MANAGER_ID="`docker node ls -f "role=manager" | awk 'FNR == 2 {print $1}'`"
docker node update --availability drain $MANAGER_ID
echo "{\"id\":\"$MANAGER_ID\",\"token\":\"$TOKEN\",\"worker\":\"$TOKEN_WORKER\"}" > $OMNEEDIA_MANAGER/.manager

cd $OMNEEDIA_MANAGER/bin
npm install
