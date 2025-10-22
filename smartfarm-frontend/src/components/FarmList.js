import React, { useState, useEffect } from 'react';
import api from '../api'; // 1단계에서 설정한 axios 인스턴스

const FarmList = () => {
    // 상태 변수 설정: 농장 목록, 로딩 상태, 에러 상태
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 컴포넌트가 마운트될 때 농장 목록을 가져오는 API 호출
    useEffect(() => {
        const fetchFarms = async () => {
            try {
                // 로딩 시작
                setLoading(true);
                // GET /api/farms API 호출
                const response = await api.get('/api/farms');
                // 성공 시, 상태에 데이터 저장
                setFarms(response.data);
                setError(null);
            } catch (err) {
                // 실패 시, 에러 메시지 저장
                setError('농장 목록을 불러오는 데 실패했습니다.');
                console.error(err);
            } finally {
                // 로딩 종료
                setLoading(false);
            }
        };

        fetchFarms();
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때 한 번만 실행

    // 로딩 중일 때 표시할 UI
    if (loading) {
        return <div>로딩 중...</div>;
    }

    // 에러 발생 시 표시할 UI
    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    // 농장 목록을 표시할 UI
    return (
        <div>
            <h2>내 농장 목록</h2>
            {farms.length === 0 ? (
                <p>등록된 농장이 없습니다. 새 농장을 추가해보세요!</p>
            ) : (
                farms.map(farm => (
                    <div key={farm.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                        <h3>{farm.name}</h3>
                        <p>{farm.address}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default FarmList;