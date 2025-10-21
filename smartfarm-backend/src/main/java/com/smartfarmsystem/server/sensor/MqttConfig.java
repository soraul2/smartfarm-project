package com.smartfarmsystem.server.sensor;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

@Configuration
public class MqttConfig {

	private static final Logger log = LoggerFactory.getLogger(MqttConfig.class);

	@Value("${mqtt.broker.url}")
	private String brokerUrl;
	
	@Value("${mqtt.client.id}")
	private String clientId;
	
	@Value("${mqtt.default.topic}")
	private String defaultTopic;
	
    @Value("${mqtt.username}")
    private String username;

    @Value("${mqtt.password}")
    private String password;
	
	@Autowired
	private SensorDataService sensorDataService;

	// ObjectMapper를 Bean으로 등록하여 재사용
	@Bean
	public ObjectMapper objectMapper() {
		return new ObjectMapper();
	}
	
	//MQTT 클라이언트 설정을 위한 Factory 생성
    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[] { brokerUrl });
        // 사용자 이름과 비밀번호 설정 추가
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        options.setAutomaticReconnect(true); // 재연결 시도
        options.setCleanSession(true);
        factory.setConnectionOptions(options);
        return factory;
    }
	// MQTT 메시지를 수신할 채널 설정
	@Bean
	public MessageChannel mqttInputChannel() {
		return new DirectChannel();
		
	}
	
	//Mqtt 메시지 리스너 설정
	@Bean
	public MessageProducer inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                // 💡 여러 토픽을 구독하려면 생성자의 마지막 인자로 나열합니다.
                new MqttPahoMessageDrivenChannelAdapter(clientId + "_inbound", mqttClientFactory(),
						defaultTopic,
						"smartfarmsystem/GRW-001-A/enviroment",
						"smartfarmsystem/GRW-001-B/enviroment");
        
		adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
	}
	
	//MQTT 메시지 도착 시 처리할 핸들러 설정
	@Bean
	@ServiceActivator(inputChannel = "mqttInputChannel")
	public MessageHandler handler() {
		return message -> {
			String payload = message.getPayload().toString();
			log.info("수신된 MQTT 메시지: {}", payload);
		
			try {
				//1. JSON 문자열을 SensorData 객체로 변환
				SensorData sensorData = objectMapper().readValue(payload, SensorData.class);
                
                //2. Service를 호출하여 데이터 저장
                sensorDataService.saveData(sensorData);
                
			} catch (Exception e) {
				log.error("MQTT 메시지 처리 중 오류 발생: {}", e.getMessage(), e);
			}
		};
	}
		
}
