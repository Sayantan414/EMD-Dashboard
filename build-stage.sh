git pull

git checkout stage

git pull

git merge --no-ff develop

node --max_old_space_size=5120 ./node_modules/@angular/cli/bin/ng build  --build-optimizer --aot

git push

git checkout develop

DIR="./dist/rmg"
if [ -d "$DIR" ]; then
  # Take action if $DIR exists. #
  echo "Deploying the ${DIR}..."
  scp -i ~/.ssh/softmeet_rsa -r $DIR root@64.227.173.61:/var/www/html/dms
  echo "Deployed ${DIR}..."
fi
