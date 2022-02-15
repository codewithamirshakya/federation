### Running Docker on Local Environment


**Login to Registry**

```docker login registry.maximilianmadl.de:5005```

*When prompt with username and password (enter your gitlab login credentials)*

**Run Services**


For More, environment value. add on docker-compose in environment section

Once, the environment is set on the file run

```docker-compose up -d``` #Detach mode

```docker-compose up ``` #Foreground mode


Stop Service

Press ```Ctrl + C``` if running on foreground mode

```docker-compose down``` #if running on detach mode


Exec the container

```docker exec -it <container-name> bash```

For Example,
```docker exec -it gateway sh```

Viewing Containe logs

```docker logs gateway -f```

*Recommended: If you are working on docker, it is recomended to forward all your log to stdout*

*Note : make sure that you can connect services from gateway*

You can use external network to connect services and gateway or

You can use your local ipaddresss and port 