package com.smartfarmsystem.server.sensor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SensorDataService {

	private static final Logger log = LoggerFactory.getLogger(SensorDataService.class);

	private final SensorDataRepository sensorDataRepository;

	public SensorDataService(SensorDataRepository sensorDataRepository) {
		this.sensorDataRepository = sensorDataRepository;
	}

	public void saveData(SensorData sensorData) {
		sensorDataRepository.save(sensorData);
		log.info("데이터 저장 완료: {}", sensorData.toString());
	}

}
