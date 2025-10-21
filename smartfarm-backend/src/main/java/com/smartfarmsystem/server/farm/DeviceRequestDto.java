package com.smartfarmsystem.server.farm;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceRequestDto {
    private String serial;
    private String description;
}