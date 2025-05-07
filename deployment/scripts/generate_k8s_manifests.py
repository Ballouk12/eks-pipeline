#!/usr/bin/env python3
import os
import argparse
import yaml
import json
import sys

def create_directory(directory):
    """Create directory if it doesn't exist"""
    if not os.path.exists(directory):
        os.makedirs(directory)

def write_yaml_file(filename, data):
    """Write YAML data to file"""
    with open(filename, 'w') as file:
        yaml.dump(data, file, default_flow_style=False)
    print(f"Created {filename}")

def generate_namespace(output_dir):
    """Generate namespace manifest"""
    namespace = {
        'apiVersion': 'v1',
        'kind': 'Namespace',
        'metadata': {
            'name': 'excellia'
        }
    }
    
    create_directory(output_dir)
    write_yaml_file(f"{output_dir}/00-namespace.yaml", namespace)

def generate_storage_classes(output_dir):
    """Generate storage classes for persistent volumes"""
    storage_class = {
        'apiVersion': 'storage.k8s.io/v1',
        'kind': 'StorageClass',
        'metadata': {
            'name': 'excellia-storage',
            'namespace': 'excellia'
        },
        'provisioner': 'kubernetes.io/aws-ebs',
        'parameters': {
            'type': 'gp2',
            'fsType': 'ext4'
        },
        'reclaimPolicy': 'Retain',
        'allowVolumeExpansion': True
    }
    
    create_directory(output_dir)
    write_yaml_file(f"{output_dir}/01-storage-class.yaml", storage_class)

def generate_configmaps(output_dir):
    """Generate ConfigMaps for services"""
    create_directory(output_dir)
    
    # ConfigMap pour l'environnement commun
    common_config = {
        'apiVersion': 'v1',
        'kind': 'ConfigMap',
        'metadata': {
            'name': 'common-config',
            'namespace': 'excellia'
        },
        'data': {
            'SPRING_PROFILES_ACTIVE': 'kubernetes',
            'EUREKA_CLIENT_SERVICEURL_DEFAULTZONE': 'http://discovery-service:8761/eureka/',
            'SPRING_CLOUD_CONFIG_URI': 'http://config-service:9998',
            'SPRING_KAFKA_BOOTSTRAP-SERVERS': 'kafka:9092'
        }
    }
    write_yaml_file(f"{output_dir}/common-config.yaml", common_config)
    
    # ConfigMap pour l'URL du repo Git de configuration
    config_repo = {
        'apiVersion': 'v1',
        'kind': 'ConfigMap',
        'metadata': {
            'name': 'config-repo',
            'namespace': 'excellia'
        },
        'data': {
            'SPRING_CLOUD_CONFIG_SERVER_GIT_URI': 'https://github.com/Ballouk12/excellia_config.git'
        }
    }
    write_yaml_file(f"{output_dir}/config-repo.yaml", config_repo)
    
    # ConfigMap pour le frontend
    frontend_config = {
        'apiVersion': 'v1',
        'kind': 'ConfigMap',
        'metadata': {
            'name': 'frontend-config',
            'namespace': 'excellia'
        },
        'data': {
            'NEXT_PUBLIC_API_URL': 'http://gateway-service:8888'
        }
    }
    write_yaml_file(f"{output_dir}/frontend-config.yaml", frontend_config)

def generate_secrets(output_dir):
    """Generate Secrets for services"""
    create_directory(output_dir)
    
    # Secret pour les connexions DB (à remplacer par des valeurs réelles en production)
    db_secret = {
        'apiVersion': 'v1',
        'kind': 'Secret',
        'metadata': {
            'name': 'db-credentials',
            'namespace': 'excellia'
        },
        'type': 'Opaque',
        'stringData': {
            'MYSQL_ALLOW_EMPTY_PASSWORD': 'yes',
            'SPRING_DATASOURCE_USERNAME': 'root',
            'SPRING_DATASOURCE_PASSWORD': ''
        }
    }
    write_yaml_file(f"{output_dir}/db-credentials.yaml", db_secret)

def generate_infrastructure(output_dir, build_number, ecr_repo):
    """Generate infrastructure manifests (Kafka, Zookeeper, DBs)"""
    create_directory(output_dir)
    
    # Zookeeper
    zookeeper_deployment = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
            'name': 'zookeeper',
            'namespace': 'excellia'
        },
        'spec': {
            'replicas': 1,
            'selector': {
                'matchLabels': {
                    'app': 'zookeeper'
                }
            },
            'template': {
                'metadata': {
                    'labels': {
                        'app': 'zookeeper'
                    }
                },
                'spec': {
                    'containers': [{
                        'name': 'zookeeper',
                        'image': 'zookeeper:latest',
                        'ports': [{
                            'containerPort': 2181
                        }]
                    }]
                }
            }
        }
    }
    write_yaml_file(f"{output_dir}/zookeeper-deployment.yaml", zookeeper_deployment)
    
    zookeeper_service = {
        'apiVersion': 'v1',
        'kind': 'Service',
        'metadata': {
            'name': 'zookeeper',
            'namespace': 'excellia'
        },
        'spec': {
            'selector': {
                'app': 'zookeeper'
            },
            'ports': [{
                'port': 2181,
                'targetPort': 2181
            }]
        }
    }
    write_yaml_file(f"{output_dir}/zookeeper-service.yaml", zookeeper_service)
    
    # Kafka
    kafka_deployment = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
            'name': 'kafka',
            'namespace': 'excellia'
        },
        'spec': {
            'replicas': 1,
            'selector': {
                'matchLabels': {
                    'app': 'kafka'
                }
            },
            'template': {
                'metadata': {
                    'labels': {
                        'app': 'kafka'
                    }
                },
                'spec': {
                    'containers': [{
                        'name': 'kafka',
                        'image': 'confluentinc/cp-kafka:latest',
                        'ports': [
                            {'containerPort': 9092},
                            {'containerPort': 29092}
                        ],
                        'env': [
                            {'name': 'KAFKA_BROKER_ID', 'value': '1'},
                            {'name': 'KAFKA_ZOOKEEPER_CONNECT', 'value': 'zookeeper:2181'},
                            {'name': 'KAFKA_ADVERTISED_LISTENERS', 'value': 'PLAINTEXT://kafka:29092,PLAINTEXT_HOST://kafka:9092'},
                            {'name': 'KAFKA_LISTENER_SECURITY_PROTOCOL_MAP', 'value': 'PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT'},
                            {'name': 'KAFKA_LISTENERS', 'value': 'PLAINTEXT://0.0.0.0:29092,PLAINTEXT_HOST://0.0.0.0:9092'},
                            {'name': 'KAFKA_INTER_BROKER_LISTENER_NAME', 'value': 'PLAINTEXT'},
                            {'name': 'KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR', 'value': '1'}
                        ]
                    }]
                }
            }
        }
    }
    write_yaml_file(f"{output_dir}/kafka-deployment.yaml", kafka_deployment)
    
    kafka_service = {
        'apiVersion': 'v1',
        'kind': 'Service',
        'metadata': {
            'name': 'kafka',
            'namespace': 'excellia'
        },
        'spec': {
            'selector': {
                'app': 'kafka'
            },
            'ports': [
                {'name': 'kafka-internal', 'port': 29092, 'targetPort': 29092},
                {'name': 'kafka-external', 'port': 9092, 'targetPort': 9092}
            ]
        }
    }
    write_yaml_file(f"{output_dir}/kafka-service.yaml", kafka_service)
    
    # Générer les StatefulSets pour les bases de données
    dbs = [
        {'name': 'inscription-db', 'db_name': 'inscription_db', 'port': 3306},
        {'name': 'messagerie-db', 'db_name': 'messagerie_db', 'port': 3306},
        {'name': 'notification-db', 'db_name': 'notification_db', 'port': 3306},
        {'name': 'bourse-candidature-db', 'db_name': 'bourse_candidature_db', 'port': 3306}
    ]
    
    for db in dbs:
        db_statefulset = {
            'apiVersion': 'apps/v1',
            'kind': 'StatefulSet',
            'metadata': {
                'name': db['name'],
                'namespace': 'excellia'
            },
            'spec': {
                'serviceName': db['name'],
                'replicas': 1,
                'selector': {
                    'matchLabels': {
                        'app': db['name']
                    }
                },
                'template': {
                    'metadata': {
                        'labels': {
                            'app': db['name']
                        }
                    },
                    'spec': {
                        'containers': [{
                            'name': db['name'],
                            'image': 'mysql:8.0',
                            'ports': [{
                                'containerPort': 3306
                            }],
                            'env': [
                                {'name': 'MYSQL_DATABASE', 'value': db['db_name']},
                                {'name': 'MYSQL_ALLOW_EMPTY_PASSWORD', 'valueFrom': {'secretKeyRef': {'name': 'db-credentials', 'key': 'MYSQL_ALLOW_EMPTY_PASSWORD'}}}
                            ],
                            'volumeMounts': [{
                                'name': 'data',
                                'mountPath': '/var/lib/mysql'
                            }]
                        }]
                    }
                },
                'volumeClaimTemplates': [{
                    'metadata': {
                        'name': 'data'
                    },
                    'spec': {
                        'accessModes': ['ReadWriteOnce'],
                        'storageClassName': 'excellia-storage',
                        'resources': {
                            'requests': {
                                'storage': '1Gi'
                            }
                        }
                    }
                }]
            }
        }
        write_yaml_file(f"{output_dir}/{db['name']}-statefulset.yaml", db_statefulset)
        
        db_service = {
            'apiVersion': 'v1',
            'kind': 'Service',
            'metadata': {
                'name': db['name'],
                'namespace': 'excellia'
            },
            'spec': {
                'selector': {
                    'app': db['name']
                },
                'ports': [{
                    'port': db['port'],
                    'targetPort': 3306
                }]
            }
        }
        write_yaml_file(f"{output_dir}/{db['name']}-service.yaml", db_service)

def generate_base_services(output_dir, build_number, ecr_repo):
    """Generate manifests for base services (Discovery, Config)"""
    create_directory(output_dir)
    
    # Discovery Service (Eureka)
    discovery_deployment = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
            'name': 'discovery-service',
            'namespace': 'excellia'
        },
        'spec': {
            'replicas': 1,
            'selector': {
                'matchLabels': {
                    'app': 'discovery-service'
                }
            },
            'template': {
                'metadata': {
                    'labels': {
                        'app': 'discovery-service'
                    }
                },
                'spec': {
                    'containers': [{
                        'name': 'discovery-service',
                        'image': f"{ecr_repo}/discovery-service:{build_number}",
                        'ports': [{
                            'containerPort': 8761
                        }],
                        'env': [
                            {'name': 'SERVER_PORT', 'value': '8761'},
                            {'name': 'SPRING_PROFILES_ACTIVE', 'valueFrom': {'configMapKeyRef': {'name': 'common-config', 'key': 'SPRING_PROFILES_ACTIVE'}}}
                        ]
                    }]
                }
            }
        }
    }
    write_yaml_file(f"{output_dir}/discovery-service-deployment.yaml", discovery_deployment)
    
    discovery_service = {
        'apiVersion': 'v1',
        'kind': 'Service',
        'metadata': {
            'name': 'discovery-service',
            'namespace': 'excellia'
        },
        'spec': {
            'selector': {
                'app': 'discovery-service'
            },
            'ports': [{
                'port': 8761,
                'targetPort': 8761
            }],
            'type': 'ClusterIP'
        }
    }
    write_yaml_file(f"{output_dir}/discovery-service-service.yaml", discovery_service)
    
    # Config Service
    config_deployment = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
            'name': 'config-service',
            'namespace': 'excellia'
        },
        'spec': {
            'replicas': 1,
            'selector': {
                'matchLabels': {
                    'app': 'config-service'
                }
            },
            'template': {
                'metadata': {
                    'labels': {
                        'app': 'config-service'
                    }
                },
                'spec': {
                    'containers': [{
                        'name': 'config-service',
                        'image': f"{ecr_repo}/config-service:{build_number}",
                        'ports': [{
                            'containerPort': 9998
                        }],
                        'env': [
                            {'name': 'SERVER_PORT', 'value': '9998'},
                            {'name': 'SPRING_CLOUD_CONFIG_SERVER_GIT_URI', 'valueFrom': {'configMapKeyRef': {'name': 'config-repo', 'key': 'SPRING_CLOUD_CONFIG_SERVER_GIT_URI'}}},
                            {'name': 'EUREKA_CLIENT_SERVICEURL_DEFAULTZONE', 'valueFrom': {'configMapKeyRef': {'name': 'common-config', 'key': 'EUREKA_CLIENT_SERVICEURL_DEFAULTZONE'}}},
                            {'name': 'SPRING_PROFILES_ACTIVE', 'valueFrom': {'configMapKeyRef': {'name': 'common-config', 'key': 'SPRING_PROFILES_ACTIVE'}}}
                        ]
                    }]
                }
            }
        }
    }
    write_yaml_file(f"{output_dir}/config-service-deployment.yaml", config_deployment)
    
    config_service = {
        'apiVersion': 'v1',
        'kind': 'Service',
        'metadata': {
            'name': 'config-service',
            'namespace': 'excellia'
        },
        'spec': {
            'selector': {
                'app': 'config-service'
            },
            'ports': [{
                'port': 9998,
                'targetPort': 9998
            }],
            'type': 'ClusterIP'
        }
    }
    write_yaml_file(f"{output_dir}/config-service-service.yaml", config_service)

def generate_gateway(output_dir, build_number, ecr_repo):
    """Generate manifests for API Gateway"""
    create_directory(output_dir)
    
    gateway_deployment = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
            'name': 'gateway-service',
            'namespace': 'excellia'
        },
        'spec': {
            'replicas': 2,  # Plusieurs replicas pour la haute disponibilité
            'selector': {
                'matchLabels': {
                    'app': 'gateway-service'
                }
            },
            'template': {
                'metadata': {
                    'labels': {
                        'app': 'gateway-service'
                    }
                },
                'spec': {
                    'containers': [{
                        'name': 'gateway-service',
                        'image': f"{ecr_repo}/gateway-service:{build_number}",
                        'ports': [{
                            'containerPort': 8888
                        }],
                        'env': [
                            {'name': 'SERVER_PORT', 'value': '8888'},
                            {'name': 'SPRING_PROFILES_ACTIVE', 'valueFrom': {'configMapKeyRef': {'name': 'common-config', 'key': 'SPRING_PROFILES_ACTIVE'}}},
                            {'name': 'EUREKA_CLIENT_SERVICEURL_DEFAULTZONE', 'valueFrom': {'configMapKeyRef': {'name': 'common-config', 'key': 'EUREKA_CLIENT_SERVICEURL_DEFAULTZONE'}}},
                            {'name': 'SPRING_CLOUD_CONFIG_URI', 'valueFrom': {'configMapKeyRef': {'name': 'common-config', 'key': 'SPRING_CLOUD_CONFIG_URI'}}}
                        ],
                        'readinessProbe': {
                            'httpGet': {
                                'path': '/actuator/health',
                                'port': 8888
                            },
                            'initialDelaySeconds': 60,
                            'periodSeconds': 10
                        }
                    }]
                }
            }
        }
    }
    write_yaml_file(f"{output_dir}/gateway-service-deployment.yaml", gateway_deployment)
    
    gateway_service = {
        'apiVersion': 'v1',
        'kind': 'Service',
        'metadata': {
            'name': 'gateway-service',
            'namespace': 'excellia'
        },
        'spec': {
            'selector': {
                'app': 'gateway-service'
            },
            'ports': [{
                'port': 8888,
                'targetPort': 8888
            }],
            'type': 'LoadBalancer'  # Exposer la gateway à l'extérieur
        }
    }
    write_yaml_file(f"{output_dir}/gateway-service-service.yaml", gateway_service)

def generate_microservices(output_dir, build_number, ecr_repo):
    """Generate manifests for microservices"""
    create_directory(output_dir)
    
    services = [
        {
            'name': 'inscription-service',
            'port': 8085,
            'db': 'inscription-db',
            'db_name': 'inscription_db'
        },
        {
            'name': 'messagerie-service',
            'port': 8086,
            'db': 'messagerie-db',
            'db_name': 'messagerie_db'
        },
        {
            'name': 'notification-service',
            'port': 8087,
            'db': 'notification-db',
            'db_name': 'notification_db'
        },
        {
            'name': 'gestion-bourse-candidature-service',
            'port': 8084,
            'db': 'bourse-candidature-db',
            'db_name': 'bourse_candidature_db'
        }
    ]
    
    for service in services:
        deployment = {
            'apiVersion': 'apps/v1',
            'kind': 'Deployment',
            'metadata': {
                'name': service['name'],
                'namespace': 'excellia'
            },
            'spec': {
                'replicas': 1,
                'selector': {
                    'matchLabels': {
                        'app': service['name']
                    }
                },
                'template': {
                    'metadata': {
                        'labels': {
                            'app': service['name']
                        }
                    },
                    'spec': {
                        'containers': [{
                            'name': service['name'],
                            'image': f"{ecr_repo}/{service['name']}:{build_number}",
                            'ports': [{
                                'containerPort': service['port']
                            }],
                            'env': [
                                {'name': 'SERVER_PORT', 'value': str(service['port'])},
                                {'name': 'SPRING_PROFILES_ACTIVE', 'valueFrom': {'configMapKeyRef': {'name': 'common-config', 'key': 'SPRING_PROFILES_ACTIVE'}}},
                                {'name': 'EUREKA_CLIENT_SERVICEURL_DEFAULTZONE', 'valueFrom': {'configMapKeyRef': {'name': 'common-config', 'key': 'EUREKA_CLIENT_SERVICEURL_DEFAULTZONE'}}},
                                {'name': 'SPRING_CLOUD_CONFIG_URI', 'valueFrom': {'configMapKeyRef': {'name': 'common-config', 'key': 'SPRING_CLOUD_CONFIG_URI'}}},
                                {'name': 'SPRING_KAFKA_BOOTSTRAP-SERVERS', 'valueFrom': {'configMapKeyRef': {'name': 'common-config', 'key': 'SPRING_KAFKA_BOOTSTRAP-SERVERS'}}},
                                {'name': 'SPRING_DATASOURCE_URL', 'value': f"jdbc:mysql://{service['db']}:3306/{service['db_name']}"},
                                {'name': 'SPRING_DATASOURCE_USERNAME', 'valueFrom': {'secretKeyRef': {'name': 'db-credentials', 'key': 'SPRING_DATASOURCE_USERNAME'}}},
                                {'name': 'SPRING_DATASOURCE_PASSWORD', 'valueFrom': {'secretKeyRef': {'name': 'db-credentials', 'key': 'SPRING_DATASOURCE_PASSWORD'}}}
                            ],
                            'readinessProbe': {
                                'httpGet': {
                                    'path': '/actuator/health',
                                    'port': service['port']
                                },
                                'initialDelaySeconds': 90,
                                'periodSeconds': 15
                            }
                        }]
                    }
                }
            }
        }
        write_yaml_file(f"{output_dir}/{service['name']}-deployment.yaml", deployment)
        
        svc = {
            'apiVersion': 'v1',
            'kind': 'Service',
            'metadata': {
                'name': service['name'],
                'namespace': 'excellia'
            },
            'spec': {
                'selector': {
                    'app': service['name']
                },
                'ports': [{
                    'port': service['port'],
                    'targetPort': service['port']
                }],
                'type': 'ClusterIP'
            }
        }
        write_yaml_file(f"{output_dir}/{service['name']}-service.yaml", svc)

def generate_frontend(output_dir, build_number, ecr_repo):
    """Generate manifests for frontend"""
    create_directory(output_dir)
    
    frontend_deployment = {
        'apiVersion': 'apps/v1',
        'kind': 'Deployment',
        'metadata': {
            'name': 'frontend',
            'namespace': 'excellia'
        },
        'spec': {
            'replicas': 2,  # Plusieurs replicas pour la haute disponibilité
            'selector': {
                'matchLabels': {
                    'app': 'frontend'
                }
            },
            'template': {
                'metadata': {
                    'labels': {
                        'app': 'frontend'
                    }
                },
                'spec': {
                    'containers': [{
                        'name': 'frontend',
                        'image': f"{ecr_repo}/frontend:{build_number}",
                        'ports': [{
                            'containerPort': 3000
                        }],
                        'env': [
                            {'name': 'NEXT_PUBLIC_API_URL', 'valueFrom': {'configMapKeyRef': {'name': 'frontend-config', 'key': 'NEXT_PUBLIC_API_URL'}}}
                        ]
                    }]
                }
            }
        }
    }
    write_yaml_file(f"{output_dir}/frontend-deployment.yaml", frontend_deployment)
    
    frontend_service = {
        'apiVersion': 'v1',
        'kind': 'Service',
        'metadata': {
            'name': 'frontend',
            'namespace': 'excellia'
        },
        'spec': {
            'selector': {
                'app': 'frontend'
            },
            'ports': [{
                'port': 3000,
                'targetPort': 3000
            }],
            'type': 'LoadBalancer'  # Exposer le frontend à l'extérieur
        }
    }
    write_yaml_file(f"{output_dir}/frontend-service.yaml", frontend_service)

def main():
    parser = argparse.ArgumentParser(description='Generate Kubernetes manifests for Excellia')
    parser.add_argument('--build-number', required=True, help='Build number for image tags')
    parser.add_argument('--ecr-repo', required=True, help='ECR repository prefix')
    parser.add_argument('--output-dir', required=True, help='Output directory for manifests')
    
    args = parser.parse_args()
    
    # Create main directories
    base_dir = args.output_dir
    create_directory(f"{base_dir}/configmaps")
    create_directory(f"{base_dir}/secrets")
    create_directory(f"{base_dir}/infrastructure")
    create_directory(f"{base_dir}/base-services")
    create_directory(f"{base_dir}/gateway")
    create_directory(f"{base_dir}/microservices")
    create_directory(f"{base_dir}/frontend")
    
    # Generate all manifests
    generate_namespace(base_dir)
    generate_storage_classes(f"{base_dir}/infrastructure")
    generate_configmaps(f"{base_dir}/configmaps")
    generate_secrets(f"{base_dir}/secrets")
    generate_infrastructure(f"{base_dir}/infrastructure", args.build_number, args.ecr_repo)
    generate_base_services(f"{base_dir}/base-services", args.build_number, args.ecr_repo)
    generate_gateway(f"{base_dir}/gateway", args.build_number, args.ecr_repo)
    generate_microservices(f"{base_dir}/microservices", args.build_number, args.ecr_repo)
    generate_frontend(f"{base_dir}/frontend", args.build_number, args.ecr_repo)

if __name__ == "__main__":
    main()