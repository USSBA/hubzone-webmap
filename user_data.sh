#!/bin/bash -ex
/usr/bin/aws s3 cp s3://sba-utils-general/hosted-chef/ /etc/chef --recursive
/bin/mv /etc/chef/knife.rb /root/.chef
/bin/mv /etc/chef/admin.pem /root/.chef
/bin/echo chef_server_url '"'https://api.chef.io/organizations/sbaone'"'>>/etc/chef/client.rb
/bin/echo environment '"'hzdev'"'>>/etc/chef/client.rb
/usr/bin/chef-client -o user::data_bag
/usr/bin/knife ssl fetch -s https://api.chef.io/organizations/sbaone -c /root/.chef/knife.rb
/bin/rm /etc/chef/encrypted_data_bag_secret
